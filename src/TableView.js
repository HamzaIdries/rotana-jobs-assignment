import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";

export default function TableView({columns, data}) {
    return (
        <Box component='main' sx={{p: 3}}>
        <MUIDataTable
          columns={columns}
          data={data}
          options={{
            selectableRows: 'none'
          }}
        />
      </Box>
    );
}