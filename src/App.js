import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import TableViewIcon from '@mui/icons-material/TableView';
import { extract } from '@extractus/feed-extractor'
import { useEffect, useState } from "react";
import TableView from "./TableView";
import MapView from "./MapView";

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
  const [view, setView] = useState('table');

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
          <Button color="inherit" onClick={() => {
            if (view === 'table'){
              setView('map');
            } else {
              setView('table');
            }
          }}>
            {
              view === 'table'
              ?
              <div>
                <MapIcon /> Switch to map view
              </div>
              :
              <div>
                <TableViewIcon /> Switch to table view
              </div>
            }
            
          </Button>
        </Toolbar>
      </AppBar>

      {
        view === 'table'
          ?
          <TableView columns={columns} data={data} />
          :
          <MapView data={data} />
      }
    </div>
  );
}

export default App;
