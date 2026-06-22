export type ChatMessagePayload = {
  id: string;
  message: string;
  name: string;
  photoUrl: string;
  createdAt: string;
};

export type ChatJoinPayload = {
  roomId: string;
};

export type ChatSendPayload = {
  roomId: string;
  message: ChatMessagePayload;
};
