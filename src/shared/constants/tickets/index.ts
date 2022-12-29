import data from './tickets.json';
export interface ITicket {
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  carrier: string;
  stops: number;
  price: number;
}

export const tickets: ITicket[] = data.tickets
  .map((item) => {
    return {
      ...item,
      originName: item.origin_name,
      destinationName: item.destination_name,
      departureDate: item.departure_date,
      departureTime: item.departure_time,
      arrivalDate: item.arrival_date,
      arrivalTime: item.arrival_time,
    };
  })
  .sort((a, b) => a.price - b.price);
