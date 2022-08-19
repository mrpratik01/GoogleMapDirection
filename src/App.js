import MapView from './MapView';

function App() {
  const markers = [
    {id: 1, name: 'Jhapa', position: { lat: 26.6288, lng: 87.8397 }},
    {id: 2, name: 'Udaypur', position: { lat: 26.81831, lng: 87.05917}},
    {id: 3, name: 'Janakpur', position: { lat: 26.8022442, lng: 85.9595911}},
    {id: 4, name: 'Jitpur', position: { lat: 27.11667, lng: 84.9536}},
  ]

  return (
    <div className="App">
      <MapView id='map' height='80vh' width='100vw' center={{ lat: 28.177433, lng: 84.003929 }} markers={markers}/>
    </div>
  );
}

export default App;
