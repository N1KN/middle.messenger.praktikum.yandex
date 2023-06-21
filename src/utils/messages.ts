import { MessageDTO } from 'api/chats/types';
import { getDate, isNotNil } from './common';

const _getUniqDaysFromMessages = (messages: MessageDTO[]) => {
  return Array.from(
    new Set(
      messages.map((message) => {
        const date = getDate(message.time);
        return date.day;
      }),
    ),
  );
};

export const getIdUniqDays = (messages: MessageDTO[]) => {
  const uniqDates = _getUniqDaysFromMessages(messages);

  return uniqDates
    .map((uniqDate) => {
      return messages.find((message) => {
        const date = getDate(message.time);

        if (date.day === uniqDate) {
          return message;
        }
      });
    })
    .filter(isNotNil);
};
