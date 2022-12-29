type TParseDate = (strDate: string) => string;

// 12.05.18

export const parseDate: TParseDate = (strDate) => {
  const date = new Date(strDate.slice(3, 6) + strDate.split('').splice(3, 5).join(''));

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
  };

  const ruDate = new Intl.DateTimeFormat('ru', dateOptions).format(date);

  return ruDate.slice(4, -3) + ', ' + ruDate[0].toUpperCase() + ruDate.slice(1, 2);
};

type TParsePrice = (price: number, currency: string) => string;

export const parsePrice: TParsePrice = (price, currency) => {
  const DOLLAR_EXCHANGE_RATE = 72;
  const EURO_EXCHANGE_RATE = 76;

  const getRemainder = (exchangeRate: number): string => {
    return String(price / exchangeRate)
      .split('.')[1]
      .slice(0, 2);
  };

  let remainder = ' ₽';

  if (currency === 'usd') {
    remainder = '.' + getRemainder(DOLLAR_EXCHANGE_RATE) + ' $';
    price = Math.trunc(price / DOLLAR_EXCHANGE_RATE);
  }

  if (currency === 'eur') {
    remainder = '.' + getRemainder(EURO_EXCHANGE_RATE) + ' €';
    price = Math.trunc(price / EURO_EXCHANGE_RATE);
  }

  const arrParsingNum = String(price).split('').reverse();

  const parsedArr = arrParsingNum.map((item, i) => (i % 3 === 0 && i !== 0 ? item + ' ' : item));

  return parsedArr.reverse().join('') + remainder;
};

type TParseTime = (time: string) => string;

export const parseTime: TParseTime = (time) => {
  return time.length === 4 ? '0' + time : time;
};
