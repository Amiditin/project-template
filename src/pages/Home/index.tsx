import { useState } from 'react';
import { Checkbox, List, Radio, Space, Typography } from 'antd';

import { Ticket } from '@/components';
import { tickets } from '@/shared/constants';

import type { RadioChangeEvent, CheckboxOptionType } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import styles from './Home.module.scss';

const { Title } = Typography;

const optionsFilterCurrency: CheckboxOptionType[] = [
  { label: 'RUB', value: 'rub' },
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' },
];

const optionsFilterStops: CheckboxOptionType[] = [
  { value: 0, label: 'Без пересадок' },
  { value: 1, label: '1 пересадка' },
  { value: 2, label: '2 пересадки' },
  { value: 3, label: '3 пересадки' },
];

const defaultFilterStops: CheckboxValueType[] = optionsFilterStops.map((item) => item.value);

export const Home: React.FC = () => {
  const [filterCurrency, setFilterCurrency] = useState(optionsFilterCurrency[0].value);
  const [checkedListStops, setCheckedListStops] = useState<CheckboxValueType[]>(defaultFilterStops);
  const [checkAll, setCheckAll] = useState(true);

  const onChangeFilterCurrency = ({ target: { value } }: RadioChangeEvent) => {
    setFilterCurrency(value);
  };

  const onChangeFilterStops = (list: CheckboxValueType[]) => {
    setCheckedListStops(list);
    setCheckAll(list.length === optionsFilterStops.length);
  };

  const onCheckAllStops = (e: CheckboxChangeEvent) => {
    setCheckedListStops(e.target.checked ? defaultFilterStops : []);
    setCheckAll(e.target.checked);
  };

  return (
    <main className={styles.home}>
      <Space className={styles.filters} direction="vertical" size="large">
        <Space direction="vertical" size="small">
          <Title level={4}>Валюта</Title>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            size="large"
            options={optionsFilterCurrency}
            onChange={onChangeFilterCurrency}
            value={filterCurrency}
          />
        </Space>
        <Space direction="vertical" size="small">
          <Title level={4}>Количество пересадок</Title>
          <Checkbox onChange={onCheckAllStops} checked={checkAll}>
            Все
          </Checkbox>
          <Checkbox.Group
            className={styles.checkboxGroup}
            options={optionsFilterStops}
            value={checkedListStops}
            onChange={onChangeFilterStops}
          />
        </Space>
      </Space>
      <List
        className={styles.list}
        itemLayout="vertical"
        size="large"
        pagination={{ style: { textAlign: 'center' }, pageSize: 3 }}
        dataSource={tickets.filter((item) => checkedListStops.includes(item.stops))}
        renderItem={(item, index) => (
          <List.Item className={styles.item} key={index}>
            <Ticket ticket={item} currency={String(filterCurrency)} />
          </List.Item>
        )}
      />
    </main>
  );
};
