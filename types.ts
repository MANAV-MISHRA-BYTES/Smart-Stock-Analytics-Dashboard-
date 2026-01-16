
export interface StockMetric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

export interface QuarterlySales {
  quarter: string;
  revenue: number;
  growth: number;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  marketCap: string;
  peRatio: string;
  parentCompany: string;
  holdingCompany: string;
  bondYields: string;
  metrics: StockMetric[];
  salesData: QuarterlySales[];
  news: NewsItem[];
  smartAnalysis: string;
  groundingSources: Array<{title: string, uri: string}>;
}

export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  AREA = 'AREA'
}
