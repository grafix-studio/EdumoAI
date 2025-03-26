import MistralClient from '@mistralai/mistralai';

const client = new MistralClient('DjyJA9MFtGcViA7SvdgIp3Fg4iH7tPrW');

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const chatResponse = await client.chat({
      model: 'mistral-tiny',
      messages: [{ role: 'user', content: message }],
    });

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};