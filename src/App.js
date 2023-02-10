import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";
import { extract } from '@extractus/feed-extractor'
import { useEffect, useState } from "react";

const columns = ['Job Title', 'Location'];

async function storeData(setData) {
  const CORS_PROXY = 'https://hamza-cors.herokuapp.com/';
  const URL = "https://www.rotanacareers.com/live-bookmarks/all-rss.xml";
  const response = await extract(
    CORS_PROXY + URL,
    {
      getExtraEntryFields: feedData => {
        const city = feedData.city;
        const country = feedData.country;
        return {
          location: city ? `${city}, ${country}` : country
        };
      }
    }  
  );
  setData(response.entries.map(entry => {
    return [entry.title, entry.location];
  }));
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    storeData(setData);
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            Rotana Jobs
          </Typography>
          <Button color="inherit">
            <MapIcon />
            Switch to map view
          </Button>
        </Toolbar>
      </AppBar>

      <Box component='main' sx={{p: 3}}>
        <MUIDataTable
          columns={columns}
          data={data}
          options={{
            selectableRows: 'none'
          }}
        />
      </Box>
    </div>
  );
}

export default App;
