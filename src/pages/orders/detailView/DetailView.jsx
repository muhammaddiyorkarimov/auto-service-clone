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
import Branch from './../../../services/landing/branch';
import bydImage from '../../../images/branchImages/branch byd.png';
import kiaImage from '../../../images/branchImages/branch ki.png';
import cheryImage from '../../../images/branchImages/branch cherry.png';
import havalImage from '../../../images/branchImages/branch haval.png';
import jettaImage from '../../../images/branchImages/branch jetta.png';
import line from '../../../images/image.png';

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
  const [branchesData, setBranchesData] = useState([])

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

  const { data: branch } = useFetch(Branch.getbranch)
  console.log(branch)

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

  const branchImages = {
    'BYD Фергана': bydImage,
    'KIA Фергана': kiaImage,
    'Chery Фергана': cheryImage,
    'Haval Фергана': havalImage,
    'Jeta Фергана': jettaImage
  };

  const branchName = localStorage.getItem('branch_name');
  const address = localStorage.getItem('address');
  const phoneNumber = localStorage.getItem('phone_number');

  console.log(data)

  return (
    <div className='order-detail-view'>
      <style>
        {`
    @media print {
      .actions-btn {
        display: none;
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
        <div className="order-detail-header">
          <div className="branch-logo">
            {branchImages[branchName] ? (
              <img src={branchImages[branchName]} alt={branchName} />
            ) : (
              ''
            )}
          </div>
          <div className="branch-details">
            <div className="name">
              {branchName ? branchName.split(' ')[0] : 'Unknown Branch'}
            </div>
            <p>Adpec: {address || 'No address available'}</p>
            <p> Тел: {phoneNumber || 'No phone number available'}</p>
          </div>
        </div>
        <div className="main-details-top">
          <div className="item">
            <p>Заказ - нарйад № {data?.id}</p>
          </div>
          <div className="item">
            {/* <p>
              {new Date(data?.created_at).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </p> */}
            {new Date(data.created_at).toLocaleString()}
          </div>
          <div className="item">
            <span>Клиент</span>
            <p>
              {data?.customer?.first_name + ' ' + data?.customer?.last_name}
            </p>
          </div>
        </div>
        <div className="main-details-top-items">
          <div className="item">
            <span>Дата начала работы по заказу: {new Date(data?.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}</span>
            <span>Дата закрытия заказа: {new Date(data?.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}</span>
            <span>Планируемая дата закрытия заказа: {new Date(data?.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}</span>
            <span>Контролирующий порядок: {managerById?.first_name ? managerById?.first_name + ' ' + managerById?.last_name : '_'}</span>
          </div>
        </div>
        <DialogContent className='oreder-details-wrapper'>
          <CardContent style={{ marginTop: '-20px' }}>
            <Typography variant="h6" className="typography-section">Информация о клиенте</Typography>
            <Typography variant="subtitle1"><strong>Номер телефона:</strong> {data.customer?.phone_number}</Typography>
            <Typography variant="subtitle1"><strong>Общий:</strong> {formatNumberWithCommas(data.paid + data.debt)}</Typography>
            <Typography variant="subtitle1"><strong>Оплачено:</strong> {formatNumberWithCommas(data.paid)}</Typography>
            <Typography variant="subtitle1"><strong>Задолженность:</strong> {formatNumberWithCommas(data.debt)}</Typography>
            {data.description && <Typography variant="subtitle1"><strong>Комментарий:</strong> {data.description}</Typography>}
            <Divider style={{ margin: '10px 0' }} />
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
                  {data?.car_kilometers_odo ? (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по одометру: <p>{data?.car_kilometers_odo} км</p>
                    </th>
                  ) : ''}
                  {data?.car_kilometers_ev ? (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по EV: <p>{data?.car_kilometers_ev} км</p>
                    </th>
                  ) : ''}
                  {data?.car_kilometers_hev ? (
                    <th style={{ border: '1px solid black' }}>
                      Пробег по HEV: <p>{data?.car_kilometers_hev} км</p>
                    </th>
                  ) : ''}
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
                <th style={{ border: '1px solid black' }}>Скидка</th>
                <th style={{ border: '1px solid black' }}>Общий</th>
              </tr>
              {data?.products?.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black' }}>{product.product?.name}</td>
                  <td style={{ border: '1px solid black' }}>{product.amount}</td>
                  <td style={{ border: '1px solid black' }}>{product.discount}</td>
                  <td style={{ border: '1px solid black' }}>{formatNumberWithCommas(product.total)}</td>
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
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button className='actions-btn' onClick={handleClose} color="secondary">Bekor qilish</Button>
          <Button className='actions-btn' onClick={handlePrintAction} color="primary">Chop etish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DetailView;
