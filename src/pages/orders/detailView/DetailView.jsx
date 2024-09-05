import React, { useState, useEffect, useCallback } from 'react';
import './detailView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import OrdersService from '../../../services/landing/orders';
import SideBar from '../../../components/sidebar/SideBar';
import Navbar from '../../../components/navbar/Navbar';
import Loader from '../../../helpers/loader/Loader';
import OrdersManagers from '../../../services/landing/manager';
import useFetch from '../../../hooks/useFetch';
import OrderServices from '../../../services/landing/orderService';

function DetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [workers, setWorkers] = useState({});
  const [workerIds, setWorkerIds] = useState([]);
  const [workersData, setWorkersData] = useState({});

  const fetchManagerForOrder = useCallback(() => {
    if (data?.manager) {
      return OrdersManagers.getOrdersById(data?.manager);
    }
  }, [data?.manager]);
  const { data: managerById } = useFetch(fetchManagerForOrder);

  const fetchWorkersData = useCallback(async () => {
    if (workerIds?.length > 0) {
      const workersResponse = await Promise.all(
        workerIds?.map((id) => OrderServices.getOrdersById(id))
      );
      const workers = workersResponse?.reduce((acc, worker) => {
        acc[worker.id] = worker; // Worker id orqali ma'lumotlarni saqlash
        return acc;
      }, {});
      setWorkersData(workers);
    }
  }, [workerIds]);

  useEffect(() => {
    if (data?.services) {
      const uniqueWorkerIds = [...new Set(data?.services.map((service) => service.id))];
      setWorkerIds(uniqueWorkerIds);
    }
  }, [data]);

  useEffect(() => {
    fetchWorkersData();
  }, [workerIds, fetchWorkersData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await OrdersService.getOrdersById(id);
        setData(result);
      } catch (err) {
        setError(err.message || "Ошибка при получении данных");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const handlePrint = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handlePrintAction = () => {
    window.print();
    setOpenModal(false);
  };


  const today = new Date().toLocaleDateString()

  function formatNumberWithCommas(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }



  return (
    <div className='order-detail-view'>
      <style>
        {`
    @media print {
      .MuiDialogActions-root {
        display: none;
      }
      .print-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 100px;
      }
      .print-info div {
        margin-bottom: 10px;
      }
      .line {
        width: 200px;
        height: 1px;
        background-color: black;
      }
        .oreder-details-wrapper table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
}

.oreder-details-wrapper table, th, td {
    border: 1px solid black;
    padding: 5px;
}

.oreder-details-wrapper table thead th {
    text-align: left;
    vertical-align: top;
}

.oreder-details-wrapper table thead th[rowspan="2"] {
    width: 20%;
}

.oreder-details-wrapper table thead td {
    text-align: left;
}

.oreder-details-wrapper table thead td {
    width: 30%;
}

.oreder-details-wrapper table tbody th, 
.oreder-details-wrapper table tbody td {
    text-align: left;
}

.oreder-details-wrapper table th p,
.oreder-details-wrapper table td p {
    font-weight: 400;
    margin: 0;
}

    }
  `}
      </style>
      <SideBar />
      <main>
        <Navbar title="Просмотреть полную информацию" />
        <section className="oreder-details-wrapper">
          {loading ? <Loader /> : error ? <p>{error}</p> : (
            <Card>
              <CardContent className="card-content">
                <div className="header-content">
                  <Typography variant="h5" className="subtitle">Детали заказа</Typography>
                  <Button variant="outlined" onClick={handlePrint}><i className="fa-solid fa-print" style={{ paddingRight: '10px' }}></i>Печать</Button>
                </div>
                <Divider style={{ margin: '20px 0' }} />

                <Typography variant="subtitle1"><strong>Время создания:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
                <Typography variant="subtitle1"><strong>Общий:</strong> {formatNumberWithCommas(data.paid + data.debt)}</Typography>
                <Typography variant="subtitle1"><strong>Оплачено:</strong> {formatNumberWithCommas(data.paid)}</Typography>
                <Typography variant="subtitle1"><strong>Задолженность:</strong> {formatNumberWithCommas(data.debt)}</Typography>

                <Typography variant="h6" className="typography-section">Информация о клиенте</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Имя:</strong> {data.customer?.first_name}</Typography>
                <Typography variant="subtitle1"><strong>Фамилия:</strong> {data.customer?.last_name}</Typography>
                <Typography variant="subtitle1"><strong>Номер телефона:</strong> {data.customer?.phone_number}</Typography>
                <Typography variant="subtitle1"><strong>Комментарий:</strong> {data.description}</Typography>

                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Менеджер:</strong> {managerById?.first_name ? managerById?.first_name + ' ' + managerById?.last_name : '_'}</Typography>
                <table className="oreder-details-wrapper">
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black' }} rowSpan="2">Модель: <p>{data?.car?.name + ' ' + data?.car?.brand}</p></th>
                      <th style={{ border: '1px solid black' }} rowSpan="2">VIN-код: <p>{data?.car?.code}</p></th>
                    </tr>
                    <tr>
                      <th style={{ border: '1px solid black' }}>Госномер: <p>{data?.car?.state_number}</p></th>
                      <th style={{ border: '1px solid black' }}>Пробег по одометру: <p>{data?.car_kilometers_odo} км</p></th>
                      <th style={{ border: '1px solid black' }}>Пробег по EV: <p>{data?.car_kilometers_ev} км</p></th>
                      <th style={{ border: '1px solid black' }}>Пробег по HEV: <p>{data?.car_kilometers_hev} км</p></th>
                    </tr>
                  </thead>
                </table>
                <table>
                  {data?.products?.length > 0 &&
                    <>
                      <tr>
                        <th style={{ border: '1px solid black' }} colspan="4">Продукты</th>
                      </tr>
                      <tr>
                        <th style={{ border: '1px solid black' }}>Название</th>
                        <th style={{ border: '1px solid black' }}>Количество</th>
                        <th style={{ border: '1px solid black' }}>Общий</th>
                        <th style={{ border: '1px solid black' }}>Скидка</th>
                      </tr>
                      {data?.products?.map((product, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black' }}>{product.product?.name}</td>
                          <td style={{ border: '1px solid black' }}>{product.amount}</td>
                          <td style={{ border: '1px solid black' }}>{formatNumberWithCommas(product.total)}</td>
                          <td style={{ border: '1px solid black' }}>{product.discount}</td>
                        </tr>
                      ))}
                    </>
                  }
                </table>
                <table>
                  <tr>
                    <th colspan="4">Услуги</th>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid black' }}>Сотрудник</th>
                    <th style={{ border: '1px solid black' }}>Н/Ч</th>
                    <th style={{ border: '1px solid black' }}>Название услуги</th>
                    <th style={{ border: '1px solid black' }}>Общий</th>
                  </tr>
                  {data?.services?.map((service, index) => (
                    <tr key={index}>
                      {console.log(workersData[service.id])}
                      <td style={{ border: '1px solid black' }}>
                        {workersData[service.id]
                          ? `${workersData[service.id].worker.first_name} ${workersData[service.id].worker.last_name}`
                          : '__'}
                      </td>
                      <td style={{ border: '1px solid black' }}>{service.part}</td>
                      <td style={{ border: '1px solid black' }}>{service.service?.name}</td>
                      <td style={{ border: '1px solid black' }}>{formatNumberWithCommas(service.total)}</td>
                    </tr>
                  ))}
                </table>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Детали заказа</DialogTitle>
        <DialogContent className='oreder-details-wrapper' dividers>
          <CardContent>
            <Typography variant="subtitle1"><strong>Время создания:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
            <Typography variant="subtitle1"><strong>Общий:</strong> {formatNumberWithCommas(data.paid + data.debt)}</Typography>
            <Typography variant="subtitle1"><strong>Оплачено:</strong> {formatNumberWithCommas(data.paid)}</Typography>
            <Typography variant="subtitle1"><strong>Задолженность:</strong> {formatNumberWithCommas(data.debt)}</Typography>

            <Typography variant="h6" className="typography-section">Информация о клиенте</Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="subtitle1"><strong>Имя:</strong> {data.customer?.first_name}</Typography>
            <Typography variant="subtitle1"><strong>Фамилия:</strong> {data.customer?.last_name}</Typography>
            <Typography variant="subtitle1"><strong>Номер телефона:</strong> {data.customer?.phone_number}</Typography>
            <Typography variant="subtitle1"><strong>Комментарий:</strong> {data.description}</Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="subtitle1"><strong>Менеджер:</strong> {managerById?.first_name + ' ' + managerById?.last_name}</Typography>
            <table className="order-details-wrapper">
              <thead>
                <tr>
                  <th style={{ border: '1px solid black' }} rowSpan="2">
                    Модель: <p>{data?.car?.name + ' ' + data?.car?.brand}</p>
                  </th>
                  <th style={{ border: '1px solid black' }} rowSpan="2">
                    VIN-код: <p>{data?.car?.code}</p>
                  </th>
                </tr>
                <tr>
                  <th style={{ border: '1px solid black' }}>
                    Госномер: <p>{data?.car?.state_number}</p>
                  </th>

                  {/* Yurgan kilometrlari shart bo'yicha */}
                  {data?.car_kilometers_odo && (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по одометру: <p>{data?.car_kilometers_odo} км</p>
                    </th>
                  )}
                  {data?.car_kilometers_ev && (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по EV: <p>{data?.car_kilometers_ev} км</p>
                    </th>
                  )}
                  {data?.car_kilometers_hev && (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по HEV: <p>{data?.car_kilometers_hev} км</p>
                    </th>
                  )}

                  {/* Umumiy yurgan kilometri */}
                  {/* <th style={{ border: '1px solid black' }}>
                    Yurgan kilometri: <p>{data?.car_kilometers} km</p>
                  </th> */}
                </tr>
              </thead>
            </table>

            {data?.products?.length > 0 && <table>
              <tr>
                <th style={{ border: '1px solid black' }} colspan="4">Продукты</th>
              </tr>
              <tr>
                <th style={{ border: '1px solid black' }}>Название</th>
                <th style={{ border: '1px solid black' }}>Количество</th>
                <th style={{ border: '1px solid black' }}>Общий</th>
                <th style={{ border: '1px solid black' }}>Скидка</th>
              </tr>
              {data?.products?.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black' }}>{product.product?.name}</td>
                  <td style={{ border: '1px solid black' }}>{product.amount}</td>
                  <td style={{ border: '1px solid black' }}>{formatNumberWithCommas(product.total)}</td>
                  <td style={{ border: '1px solid black' }}>{product.discount}</td>
                </tr>
              ))}
            </table>}
            <table>
              <tr>
                <th style={{ border: '1px solid black' }} colspan="4">Услуги</th>
              </tr>
              <tr>
                <th style={{ border: '1px solid black' }}>Сотрудник</th>
                <th style={{ border: '1px solid black' }}>Н/Ч</th>
                <th style={{ border: '1px solid black' }}>Название услуги</th>
                <th style={{ border: '1px solid black' }}>Общий</th>
              </tr>
              {data?.services?.map((service, index) => (
                    <tr key={index}>
                      {console.log(workersData[service.id])}
                      <td style={{ border: '1px solid black' }}>
                        {workersData[service.id]
                          ? `${workersData[service.id].worker.first_name} ${workersData[service.id].worker.last_name}`
                          : '__'}
                      </td>
                      <td style={{ border: '1px solid black' }}>{service.part}</td>
                      <td style={{ border: '1px solid black' }}>{service.service?.name}</td>
                      <td style={{ border: '1px solid black' }}>{formatNumberWithCommas(service.total)}</td>
                    </tr>
                  ))}
            </table>
          </CardContent>
          <div className="print-info">
            <div>{today}</div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Bekor qilish</Button>
          <Button onClick={handlePrintAction} color="primary">Chop etish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DetailView;
