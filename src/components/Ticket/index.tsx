import { Button, Divider, Space, Typography } from 'antd';

import { parseDate, parsePrice, parseTime } from '@/shared/utils';

import type { ITicket } from '@/shared/constants';

import styles from './Ticket.module.scss';

const { Title, Text } = Typography;

const getStopsText = (stops: number): string => {
  if (stops === 0) {
    return 'Без пересадок';
  }

  if (stops === 1) {
    return '1 пересадка';
  }

  return stops + ' пересадки';
};

interface ITicketProps {
  ticket: ITicket;
  currency: string;
}

export const Ticket: React.FC<ITicketProps> = ({ currency, ticket }) => {
  return (
    <>
      <Space className={styles.infoLeft} size="small" direction="vertical">
        <Title level={4}>Перевозчик {ticket.carrier}</Title>
        <Button type="primary">Купить за {parsePrice(ticket.price, currency)}</Button>
      </Space>
      <Divider className={styles.line} type="vertical" />
      <div className={styles.info}>
        <div className={styles.timeline}>
          <Text className={styles.time}>{parseTime(ticket.departureTime)}</Text>
          <div className={styles.stops}>
            <Text className={styles.stopsText} type="secondary">
              {getStopsText(ticket.stops)}
            </Text>
            <div className={styles.arrow} />
          </div>
          <Text className={styles.time}>{parseTime(ticket.arrivalTime)}</Text>
        </div>
        <div className={styles.box}>
          <div className={styles.departure}>
            <Text strong>
              {ticket.origin}, {ticket.originName}
            </Text>
            <Text className={styles.dateText} type="secondary">
              {parseDate(ticket.departureDate)}
            </Text>
          </div>
          <div className={styles.arrival}>
            <Text strong>
              {ticket.destinationName}, {ticket.destination}
            </Text>
            <Text className={styles.dateText} type="secondary">
              {parseDate(ticket.arrivalDate)}
            </Text>
          </div>
        </div>
      </div>
    </>
  );
};
