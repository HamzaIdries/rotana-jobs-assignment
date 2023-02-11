import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import TableViewIcon from '@mui/icons-material/TableView';
import { extract } from '@extractus/feed-extractor'
import { useEffect, useState } from "react";
import TableView from "./TableView";
import MapView from "./MapView";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const columns = ['Job Title', 'Location'];

function App() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('table');
  
  useEffect(() => {
    fetch(`${backendUrl}/data.json`)
      .then(res => res.json())
      .then(data => setData(data));
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
          <TableView columns={columns} data={data.map( ({title, location}) => [title, location] )} />
          :
          <MapView data={data} />
      }
    </div>
  );
}

export default App;
