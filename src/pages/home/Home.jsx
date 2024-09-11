// Import necessary modules and components
import React, { useState } from 'react';
import ActiveReports from '../../components/activeReports/ActiveReports';
import PieChartC from '../../components/pieChart/PieChart';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import useFetch from '../../hooks/useFetch';
import Statistics from '../../services/landing/statistics';
import './home.css';
import TopTableComponent from './TopTableComponent';
import img2 from '../../images/xarajatIcon.png';
import img1 from '../../images/foydaIcon.png';
import img3 from '../../images/daromadIcon.png';
import { BiLoader } from 'react-icons/bi';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getUser } from '../../services/auth/auth';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert } from '@mui/material';

function Home() {
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [open, setOpen] = useState(false); // Modal open state
  const [errorMessage, setErrorMessage] = useState(null);


  const { data: topProducts, loading: topProductsLoading, error: topProductsError } = useFetch(Statistics.getTopProducts);
  const { data: topCalculate, loading: topCalculateLoading, error: topCalculateError } = useFetch(Statistics.getTopCalculate);
  const { data: benefitBranch, loading: benefitBranchLoading, error: benefitBranchError } = useFetch(getUser);
  const { data: walletData, loading: walletDataLoading, error: walletDataError } = useFetch(Statistics.getWallet, false);

  const productColumns = ["Название", "Количество", "Прибыль"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      const response = await Statistics.getWallet();
      if (response?.success) {
        setOpen(false);
        alert('Успешный')
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте снова.');
      }
    } catch (error) {
      setErrorMessage('Не удалось выполнить запрос.');
    }
  };

  const productData = topProducts ? topProducts?.map(product => ({
    name: product.product.name,
    amount: formatNumberWithCommas(product.product.amount ? Math.round(product.product.amount * 1000) / 1000 : 0),
    total_benefit: formatNumberWithCommas(product.product.total_benefit),
  })) : [];

  const calculateData = topCalculate ? [
    { title: "Расход", value: formatNumberWithCommas(topCalculate.total_import), img: img1 },
    { title: "Приход", value: formatNumberWithCommas(topCalculate.total_export), img: img2 },
    { title: "Чистый доход", value: formatNumberWithCommas(topCalculate.total_benefit), img: img3 },
  ] : [];

  function formatNumberWithCommas(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  const descriptionColors = ["#c70000", "green", "blue"];

  return (
    <div className="home">
      <SideBar />
      <main style={{ height: '100vh' }}>
        <Navbar title="Главная" />
        <div className="extra-items">
          <div className="header">
            <div className="items-wrapper items-wrapper-2">
              <div className="items">
                {/* Always render the cards, even if calculateData is empty */}
                {(calculateData && calculateData.length > 0 ? calculateData : [
                  { title: "Расход", value: "0", img: img1 },
                  { title: "Приход", value: "0", img: img2 },
                  { title: "Чистый доход", value: "0", img: img3 },
                ])?.map((item, index) => (
                  <div className="item" key={index}>
                    <div className="about">
                      {/* Show loader if data is still loading, otherwise display values */}
                      {topCalculateLoading ? (
                        <BiLoader />
                      ) : (
                        <>
                          <div className="title">{item.title}</div>
                          <div className="description" style={{ color: descriptionColors[index] }}>
                            {item.value || "0"} СУМ {/* Fallback to "0" if the value is missing */}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="img">
                      <img src={item.img} alt={item.title} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="benefit-branch">
                <div className="item" onClick={handleOpen}> {/* Open modal on click */}
                  <div className="about">
                    {benefitBranchLoading ? (
                      <BiLoader />
                    ) : benefitBranch ? (
                      <>
                        <div className="title">Касса</div>
                        <div className="description" style={{ color: 'blue' }}>
                          {formatNumberWithCommas(benefitBranch?.branch?.balance)} СУМ
                        </div>
                      </>
                    ) : (
                      <div>Касса: 0</div>
                    )}
                  </div>
                  <div className="img">
                    <img src={img3} alt='daromad' />
                  </div>
                  </div>
                </div>
                <div className="filter-section">
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{marginRight: '20px'}}
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="YYYY-MM-DD"
                    maxDate={dayjs().endOf('month')}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="YYYY-MM-DD"
                    minDate={startDate}
                    maxDate={dayjs().endOf('month')}
                  />
                </LocalizationProvider> */}
                </div>
              </div>
            </div>
            <div className="main">
              <ActiveReports />
              <PieChartC startDate={startDate} endDate={endDate} />
            </div>
            <div className="footer">
              <div className="cards">
                <div className="top-products">
                  <div className="title">Топ товары</div>
                  <TopTableComponent
                    loading={topProductsLoading}
                    error={topProductsError ? topProductsError.message : null} // Pass only the error message or null
                    columns={productColumns}
                    data={productData}
                  />
                </div>
              </div>
            </div>
          </div>
      </main>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Обнулить кассу</DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {walletDataLoading ? (
            <BiLoader />
          ) : (
            <div>Вы уверены, что хотите обнулить баланс?</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Отмена</Button>
          <Button onClick={handleConfirm} color="primary" disabled={walletDataLoading}>
            {walletDataLoading ? <BiLoader size={24} /> : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;