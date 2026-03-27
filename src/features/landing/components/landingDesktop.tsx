"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Truck, Warehouse } from "lucide-react";
import { useTheme } from "next-themes";
import { useTransactions } from "../hooks/useTransactions";
import { useStockHooks } from "../hooks/useStockHooks";
import { useShipHooks } from "../hooks/useShipHooks";
import { useIsMobile } from "@/hooks/useMobile";
import { useWarehouseHooks } from "../hooks/useWarehouse";

interface MonthlyData {
  month_name: string;
  stocked: number;
  shipped: number;
}

const DashboardDesktop = () => {
  const { stockedThisMonth, stockedPercentageChange } = useStockHooks();
  const { shippedThisMonth, shippedPercentageChange } = useShipHooks();
  const { transactionLoading, monthly, recentShipped, recentStocked } =
    useTransactions();
  console.log(transactionLoading, monthly, recentShipped);
  const { warehouseInventory } = useWarehouseHooks();
  const t = useTranslations("DashboardPage");

  const chartConfig = {
    stocked: {
      label: t("stocked"),
      color: "hsl(var(--chart-1))",
    },
    shipped: {
      label: t("shipped"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const maxStocked = Math.max(
    ...(monthly?.map((d: MonthlyData) => d.stocked) ?? [0])
  );
  const maxShipped = Math.max(
    ...(monthly?.map((d: MonthlyData) => d.shipped) ?? [0])
  );
  const maxY = Math.max(maxStocked, maxShipped) * 1.05;
  // console.log(monthly?.map((m) => m.month_name));

  return (
    <main className=" p-4 space-y-2 flex flex-col bg-gradient-to-b from-primary/10 to-background">
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className=" text-primary">
              {t("totalRecorded")}
            </CardTitle>
          </CardHeader>
          <CardContent className=" flex justify-between">
            <div className=" text-4xl font-bold">{`25000`}</div>
            <Warehouse className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className=" text-primary">{t("shippedParts")}</CardTitle>
          </CardHeader>
          <CardContent className=" flex justify-between">
            <div className=" flex flex-col">
              <div className=" text-4xl font-bold">{shippedThisMonth ?? 0}</div>
              {shippedPercentageChange == null ? (
                <p className="text-md text-gray-400">N/A</p>
              ) : shippedPercentageChange > 0 ? (
                <p className="text-md text-green-500">{`${shippedPercentageChange}%`}</p>
              ) : shippedPercentageChange < 0 ? (
                <p className="text-md text-destructive">{`${shippedPercentageChange}%`}</p>
              ) : (
                <p className="text-md">{`${shippedPercentageChange}%`}</p>
              )}
            </div>
            <Truck className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className=" text-primary">{t("stockedParts")}</CardTitle>
          </CardHeader>
          <CardContent className=" flex justify-between">
            <div className=" flex flex-col">
              <div className=" text-4xl font-bold">{stockedThisMonth ?? 0}</div>
              {stockedPercentageChange == null ? (
                <p className="text-md text-gray-400">N/A</p>
              ) : stockedPercentageChange > 0 ? (
                <p className="text-md text-green-500">{`${stockedPercentageChange}%`}</p>
              ) : stockedPercentageChange < 0 ? (
                <p className="text-md text-destructive">{`${stockedPercentageChange}%`}</p>
              ) : (
                <p className="text-md">{`${stockedPercentageChange}%`}</p> // for exactly 0%
              )}
            </div>
            <Package className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-6 gap-2">
        {transactionLoading ? (
          <>
            <Skeleton className=" h-[268px] col-span-3" />
            <Skeleton className=" h-[268px] col-span-3" />
          </>
        ) : (
          <>
            <Card className="col-span-3 h-[268px]">
              <CardHeader>
                <CardTitle className=" text-primary">
                  {t("warehouseTransaction")}
                </CardTitle>
              </CardHeader>
              <CardContent className=" h-[210px]">
                <ChartContainer
                  config={chartConfig}
                  className=" h-[100%] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={warehouseInventory}
                    margin={{ bottom: 22 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="warehouse"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, props) => {
                            console.log(props);
                            return (
                              <div className=" flex items-center gap-2">
                                <div className={` h-2 w-2`}></div>
                                {`${t("stocked")}: ${value}`}
                              </div>
                            );
                          }}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="stocked" radius={[0, 0, 4, 4]}>
                      {warehouseInventory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`var(--chart-${(index % 5) + 1})`}
                        />
                      ))}
                      <LabelList
                        dataKey="stocked"
                        position="insideTop"
                        fontSize={12}
                        content={(props) => {
                          const { x, y, width, height, value } = props;

                          const barHeight = Number(height); // ensure it's a number
                          const barWidth = Number(width);
                          const posX = Number(x) + barWidth / 2;
                          // Determine Y position
                          // If bar is too short, render above; else inside
                          const isAbove = barHeight < 20;
                          const posY = isAbove ? Number(y) - 4 : Number(y) + 12;

                          // if (
                          //   !x ||
                          //   !y ||
                          //   !width ||
                          //   isNaN(barHeight) ||
                          //   barHeight < 20
                          // )
                          //   return null;

                          return (
                            <text
                              x={posX}
                              y={posY}
                              //  fill="background"
                              fill={
                                isAbove ? "var(--foreground)" : "background"
                              }
                              textAnchor="middle"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {value}
                            </text>
                          );
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 h-[268px]">
              <CardHeader>
                <CardTitle className=" text-primary">
                  {t("monthlyOverview")}
                </CardTitle>
              </CardHeader>
              <CardContent className=" h-[210px]">
                <ChartContainer
                  config={chartConfig}
                  className=" h-[100%] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={monthly ?? []}
                      margin={{ right: 12, left: 14, bottom: 20 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month_name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => {
                          const translated = t(`months.${value}`, {
                            fallback: value,
                          });
                          return translated.slice(0, 3);
                        }}
                        domain={[0, maxY]}
                      />
                      <YAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        domain={[0, maxY]}
                        hide
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Line
                        dataKey="stocked"
                        type="monotone"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="shipped"
                        type="monotone"
                        stroke="var(--color-chart-2)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            {/* <div className=" grid grid-cols-1 gap-2">
              <Skeleton className=" w-full h-full" />
              <Skeleton className=" w-full h-full" />
            </div> */}
          </>
        )}
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-2">
        {transactionLoading ? (
          <>
            <Skeleton className=" h-[420px] w-full" />
            <Skeleton className=" h-[420px] w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className=" text-primary">
                    {t("recentStocked")}
                  </CardTitle>
                </div>
                <CardDescription className="text-foreground">
                  {t("desc1")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className=" hidden md:table-cell">
                        {t("lotNo")}
                      </TableHead>
                      <TableHead className=" w-fit">{t("prodCode")}</TableHead>
                      <TableHead>{t("stockNo")}</TableHead>
                      <TableHead>{t("description")}</TableHead>
                      <TableHead>{t("quantity")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStocked &&
                      recentStocked.map((item, key) => (
                        <TableRow key={key}>
                          <TableCell className="hidden md:table-cell">
                            {item.lot_no}
                          </TableCell>
                          <TableCell className="font-medium w-fit">
                            {item.product_code}
                          </TableCell>
                          <TableCell>{item.stock_no}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            {item.quantity === null ? 0 : item.quantity}
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className=" text-primary">
                    {t("recentShipped")}
                  </CardTitle>
                </div>
                <CardDescription className="text-foreground">
                  {t("desc2")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className=" hidden md:table-cell">
                        {t("lotNo")}
                      </TableHead>
                      <TableHead className=" w-fit">{t("prodCode")}</TableHead>
                      <TableHead>{t("stockNo")}</TableHead>
                      <TableHead>{t("description")}</TableHead>
                      <TableHead>{t("quantity")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentShipped &&
                      recentShipped.map((item, key) => (
                        <TableRow key={key}>
                          <TableCell className="hidden md:table-cell">
                            {item.lot_no}
                          </TableCell>
                          <TableCell className="font-medium w-fit">
                            {item.product_code}
                          </TableCell>
                          <TableCell>{item.stock_no}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            {item.quantity === null ? 0 : item.quantity}
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardDesktop;
