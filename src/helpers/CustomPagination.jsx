import { Pagination, PaginationItem } from '@mui/material';

const CustomPagination = ({ count, page, onChange }) => {
  return (
    <Pagination
    style={{marginTop: '15px'}}
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
        />
      )}
    />
  );
};

export default CustomPagination;
