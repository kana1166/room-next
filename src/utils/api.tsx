// utils/api.ts

interface APIOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
}

export async function fetchAPI(
  endpoint: string,
  { method = "GET", body = null, headers = new Headers() }: APIOptions = {}
) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

  // headersがundefinedでないことを確認し、Content-Typeを設定する
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers);
  }

  if (body) {
    headers.set("Content-Type", "application/json"); // setメソッドを使用してContent-Typeを設定する
    body = JSON.stringify(body);
  }

  const options: RequestInit = { method, headers, body };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Error response body:", errorBody);
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

export const getRooms = (): Promise<any[]> => fetchAPI("/rooms");
export const getRoomById = (id: string): Promise<any> =>
  fetchAPI(`/rooms/${id}`);
export const createBooking = (data: any): Promise<any> =>
  fetchAPI("/bookings", { method: "POST", body: data });
export const cancelBooking = (bookingId: string): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "DELETE" });

export const getExecutiveRooms = (): Promise<any[]> =>
  fetchAPI("/rooms/executive");
export const createExecutiveRoom = (data: any): Promise<any> =>
  fetchAPI("/rooms/executive", { method: "POST", body: data });
export const updateExecutiveRoom = (roomId: string, data: any): Promise<any> =>
  fetchAPI(`/rooms/executive/${roomId}`, { method: "PUT", body: data });
export const deleteExecutiveRoom = (roomId: string): Promise<any> =>
  fetchAPI(`/rooms/executive/${roomId}`, { method: "DELETE" });

export const getBookings = (): Promise<any[]> => fetchAPI("/bookings");
export const getBookingById = (id: string): Promise<any> =>
  fetchAPI(`/bookings/${id}`);
export const updateBooking = (bookingId: string, data: any): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "PUT", body: data });
export const deleteBooking = (bookingId: string): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "DELETE" });
