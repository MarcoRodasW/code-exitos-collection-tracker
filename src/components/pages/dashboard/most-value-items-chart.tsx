'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { MostValueItemsResponse } from '@/lib/types/dashboard/dahsboard.types';
import { Pie, PieChart } from 'recharts';

interface MostValueItemsChartProps {
  data: MostValueItemsResponse[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#a4de6c',
  '#d0ed57',
  '#ffc658',
  '#8dd1e1',
];

export function MostValueItemsChart({ data }: MostValueItemsChartProps) {
  const mostValueItem = data[0];
  const chartData = data.map((item, i) => ({
    name: item.name,
    value: item.price,
    fill: COLORS[i],
  }));

  const chartConfig: ChartConfig = chartData.reduce((config, item, i) => {
    config[item.name] = {
      label: item.name,
      color: COLORS[i], // Color dinámico
    };
    return config;
  }, {} as ChartConfig);

  console.log(chartConfig);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Most Value collection items</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        {data.length === 0 ? (
          <div className='grid h-full min-h-[400px] w-full place-content-center'>
            <p>No data to display</p>
          </div>
        ) : null}
        {data && data.length > 0 ? (
          <>
            <ChartContainer config={chartConfig} className=''>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={chartData}
                  dataKey='value'
                  nameKey='name'
                  stroke='0'
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill='hsla(var(--foreground))'
                      >
                        {Intl.NumberFormat('es-HN', {
                          currency: 'LPS',
                          currencyDisplay: 'symbol',
                          style: 'currency',
                        }).format(payload.value)}
                      </text>
                    );
                  }}
                />
              </PieChart>
            </ChartContainer>
            <CardFooter>
              <div className='flex w-full flex-col items-center justify-center gap-2 text-sm'>
                <p className='font-medium leading-none'>
                  The most value item is{' '}
                  <span className='font-bold'>{mostValueItem?.name}</span> with
                  a cost of{' '}
                  <span className='font-bold'>
                    {' '}
                    {Intl.NumberFormat('es-HN', {
                      currency: 'LPS',
                      currencyDisplay: 'symbol',
                      style: 'currency',
                    }).format(mostValueItem.price)}
                  </span>
                </p>
                <div className='leading-none text-muted-foreground'>
                  Year made {mostValueItem.year_made}
                </div>
              </div>
            </CardFooter>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
