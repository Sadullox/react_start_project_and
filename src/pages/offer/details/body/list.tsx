import { socket_io } from "constant/constant";
import { startSocketConnection } from "constant/socket/socket";
import { getData } from "functions/request";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleWebworkerResponse, socketListener } from "stores/orderDetails";
import store, { RootState } from "stores/store";
import { socketViewListener } from "stores/view";
import { IExecutorList } from "types/response";
import Table from "./Table";

export default function List() {
  const dispatch = useDispatch();
  const filters = useSelector((s: RootState) => s.orderDetails.filters);
  const handleChange: Worker = useMemo(() => {
    const myWorker = new Worker(
      new URL("functions/web worker/orderWorker.worker.ts", import.meta.url)
    );
    myWorker.onmessage = function ({
      data,
    }: MessageEvent<{
      allOrders: IExecutorList[];
      lessOrders: IExecutorList[];
      source_type_count: { [key: string]: number };
      status_count: { [key: string]: number };
    }>) {
      // dispatch(handleWebworkerResponse(data));
      // dispatch(setLessOrders(data.lessOrders));
      // dispatch(setAllOrders(data.allOrders));
      /* ---------------------------- vaqtincha o'chiq ---------------------------- */
      // const body = document.querySelector(
      //   ".order__list .ant-table-tbody"
      // ) as HTMLTableElement;
      // if (body && data.htmlStr) {
      //   body.innerHTML = data.htmlStr;
      // }
    };
    return myWorker;
  }, []);

  useEffect(() => {
    getData<{ list: IExecutorList[] }>({
      url: "/orders?column=id&order=asc",
    }).then(res => {
      handleChange.postMessage({
        event: "",
        order: {},
        allOrders: res.result?.list,
        filters: filters,
      });
    });
  }, []);

  useEffect(() => {
    startSocketConnection().then((socket: any) => {
      socket
        ?.private(socket_io.order_channel)
        ?.listen(
          socket_io.order_listen_channel,
          (res: { event: string; data: { [key: string]: any } }) => {
            dispatch(socketViewListener(res.data));
            dispatch(socketListener(res.data));
            handleChange.postMessage({
              event: res.event,
              order: res.data,
              allOrders: store.getState().orderDetails.allOrders,
              filters: store.getState().orderDetails.filters,
            });
          }
        );
    });
  }, []);

  useEffect(() => {
    handleChange.postMessage({
      event: "",
      order: {},
      allOrders: store.getState().orderDetails.allOrders,
      filters: filters,
    });
  }, [filters]);

  const table = useMemo(() => {
    return <Table />;
  }, []);

  return <div className="order__list">{table}</div>;
}

// закас принят - buyurtma qabul qilinadi
// вадитель назначен - ijrochi tayinlanadi
// Buyurtma bajarilmoqda - Buyurtma bajarilmoqda

// const NEW = "new"; // Новый - Yangi
// const SENDING = "sending"; // Отправлен - Yuborildi
// const APPOINTED = "appointed"; // Назначен - Biriktirildi
// const AT_ADDRESS = "at_address"; // По адресу - Manzilda
// const CONFIRMED = "confirmed"; // Подтверждён - Tasdiqlandi
// const ASSEMBLED = "assembled"; // Собран - Yig'ilgan
// const SHIPPED = "shipped"; // Отгружён - Yuklandi
// const IN_FETTERS = "in_fetters"; // В пути - Yo'lda
// const DELIVERED = "delivered"; // Доставлен - Yetkazildi
// const COMPLETED = "completed"; // Выполнен - Bajarildi
// const CANCELLED = "canceled"; // Отменен - Bekor qilindi
// const PRELIMINARIES = "preliminaries"; // предварительные - rejalashtirilgan
