import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages, GetRoomMessagesResponse } from "../http/get-room-messages";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function Messages() {
  const queryClient = useQueryClient()
  const { roomID } = useParams()

  if (!roomID) {
    throw new Error("Messages component must be used within room page")
  }

  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomID],
    queryFn: () => getRoomMessages({ roomId: roomID }),
  })

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomID}`)

    ws.onopen= () => {
      console.log("Websocket connected!")
    }

    ws.onclose= () => {
      console.log("Websocket closed!")
    }

    ws.onmessage = (event) => {
      const data: {
        kind: 'message_created' | 'message_answered' | 'message_reaction_increased' | 'message_reaction_decreased'
        value: any
      } = JSON.parse(event.data)

      console.log(data)

      switch(data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomID], state => {
            return {
              messages: [
                ...(state?.messages ?? []),
                {
                  id: data.value.id,
                  text: data.value.message,
                  amountOfReactions: 0,
                  answered: false,
                }
              ]
            }
          })
          break
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomID], state => {
            if (!state) {
              return undefined
            }

            return {
              messages: state.messages.map(item => {
                if (item.id === data.value.id) {
                  return {
                    ...item,
                    answered: true
                  }
                }

                return item
              })
            }
          })
          break
        case 'message_reaction_increased':
        case 'message_reaction_decreased':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomID], state => {
            if (!state) {
              return undefined
            }

            return {
              messages: state.messages.map(item => {
                if (item.id === data.value.id) {
                  return {
                    ...item,
                    amountOfReactions: data.value.count
                  }
                }

                return item
              })
            }
          })
          break
      }
    }

    return () => {
      ws.close()
    }
  }, [roomID, queryClient])

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {data.messages.map(message => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            answered={message.answered}
            amountOfReactions={message.amountOfReactions} 
          />
        )
      })}
    </ol>
  )
}