import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Drones.css";

const DRONES_KEY = "drones_data";
const ORDERS_KEY = "orders_data";

const defaultDrones = [
  { id: 1, name: "Drone 1", status: "ready", eta: null },
  { id: 2, name: "Drone 2", status: "ready", eta: null },
  { id: 3, name: "Drone 3", status: "ready", eta: null },
];

const defaultOrders = [
  { id: 101, store: "Pizza House", user: "Alice", status: "pending", drone: "", dronePos: null },
  { id: 102, store: "Sushi King", user: "Bob", status: "pending", drone: "", dronePos: null },
  { id: 103, store: "Burger Zone", user: "Charlie", status: "pending", drone: "", dronePos: null },
  { id: 104, store: "Pizza House", user: "Dave", status: "pending", drone: "", dronePos: null },
  { id: 105, store: "Sushi King", user: "Eve", status: "pending", drone: "", dronePos: null },
];

const storeLocations = {
  "Pizza House": [10.7769, 106.7009],
  "Sushi King": [10.7800, 106.7020],
  "Burger Zone": [10.7790, 106.7010],
};
const userLocations = {
  Alice: [10.7780, 106.7050],
  Bob: [10.7810, 106.7040],
  Charlie: [10.7770, 106.7060],
  Dave: [10.7820, 106.7030],
  Eve: [10.7795, 106.7070],
};

const droneIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/414/414927.png", iconSize: [40, 40] });
const storeIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [30, 30] });
const userIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png", iconSize: [30, 30] });

const translateDroneStatus = (status) => {
  switch(status){
    case "ready": return "Sẵn sàng";
    case "delivering": return "Đang giao";
    case "maintenance": return "Bảo trì";
    case "low_battery": return "Pin yếu";
    default: return status;
  }
};
const translateOrderStatus = (status) => {
  switch(status){
    case "pending": return "🕓 Chờ giao";
    case "delivering": return "🚁 Đang giao";
    case "done": return "✅ Hoàn thành";
    default: return status;
  }
};

const DroneOrders = () => {
  const [drones, setDrones] = useState(JSON.parse(localStorage.getItem(DRONES_KEY)) || defaultDrones);
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem(ORDERS_KEY)) || defaultOrders);
  const [newDroneName, setNewDroneName] = useState("");

  useEffect(()=>{ localStorage.setItem(DRONES_KEY, JSON.stringify(drones)); }, [drones]);
  useEffect(()=>{ localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }, [orders]);

  const addDrone = () => {
    if(!newDroneName) return;
    setDrones([...drones, { id: Date.now(), name: newDroneName, status:"ready", eta:null }]);
    setNewDroneName("");
  };

  const changeDroneStatus = (index, newStatus) => {
    setDrones(drones.map((drone,i)=> i===index ? {...drone, status:newStatus} : drone));
  };

  const startDelivery = (droneIndex, orderId) => {
    const drone = drones[droneIndex];
    if(drone.status !== "ready") return alert("🚨 Drone không thể giao!");

    const order = orders.find(o=>o.id===orderId);
    const start = storeLocations[order.store];
    const end = userLocations[order.user];
    const steps = 100;
    let step = 0;

    // Cập nhật drone và đơn hàng khi bắt đầu giao
    setDrones(drones.map((d,i)=> i===droneIndex ? {...d, status:"delivering", eta:5} : d));
    setOrders(orders.map(o=> o.id===orderId ? {...o, status:"delivering", drone:drone.name, dronePos:start} : o));

    const interval = setInterval(()=>{
      step++;
      const lat = start[0] + ((end[0]-start[0])*step/steps);
      const lng = start[1] + ((end[1]-start[1])*step/steps);

      setOrders(prev=>prev.map(o=> o.id===orderId ? {...o, dronePos:[lat,lng]} : o));
      setDrones(prev=>prev.map((d,i)=> i===droneIndex ? {...d, eta: Math.max(0, ((steps-step)/20).toFixed(1))} : d));

      if(step>=steps){
        clearInterval(interval);
        let backStep = 0;
        const backInterval = setInterval(()=>{
          backStep++;
          const latBack = end[0] + ((start[0]-end[0])*backStep/steps);
          const lngBack = end[1] + ((start[1]-end[1])*backStep/steps);
          setOrders(prev=>prev.map(o=> o.id===orderId ? {...o, dronePos:[latBack,lngBack]} : o));
          if(backStep>=steps){
            clearInterval(backInterval);
            setOrders(prev=>prev.map(o=> o.id===orderId ? {...o, status:"done", dronePos:null} : o));
            setDrones(prev=>prev.map((d,i)=> i===droneIndex ? {...d, status:"ready", eta:null} : d));
          }
        },50);
      }
    },50);
  };

  const restartOrders = () => {
    const doneOrders = orders.filter(o=>o.status==="done");
    if(doneOrders.length===0) return alert("Không có đơn nào đã giao để restart!");
    setOrders(prev=>prev.map(o=> o.status==="done" ? {...o, status:"pending", drone:"", dronePos:null} : o));
    setDrones(prev=>prev.map(d=> ({...d, status:"ready", eta:null})));
  };

  const deleteDrone = (index) => {
    if(drones[index].status==="delivering") return alert("🚨 Không thể xóa drone đang giao!");
    setDrones(drones.filter((_,i)=>i!==index));
  };

  return (
    <div className="drones-container">
      <h1>🚁 Quản lý Drone + Orders (5 đơn)</h1>

      <div className="drone-form">
        <input type="text" placeholder="Tên Drone mới" value={newDroneName} onChange={e=>setNewDroneName(e.target.value)} />
        <button onClick={addDrone}>Thêm Drone</button>
        <button onClick={restartOrders} style={{marginLeft:"10px"}}>🔄 Restart đơn đã giao</button>
      </div>

      <table className="drones-table">
        <thead>
          <tr><th>ID</th><th>Tên Drone</th><th>Trạng thái</th><th>ETA</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {drones.map((drone,index)=>(
            <tr key={drone.id}>
              <td>{index+1}</td>
              <td>{drone.name}</td>
              <td>{translateDroneStatus(drone.status)}</td>
              <td>{drone.eta ? `${drone.eta}s` : "-"}</td>
              <td>
                {orders.filter(o=>o.status==="pending").length>0 &&
                  <select 
                    onChange={e=>startDelivery(index, Number(e.target.value))} 
                    defaultValue="" 
                    disabled={drone.status!=="ready"}>
                    <option value="">🚀 Giao đơn</option>
                    {orders.filter(o=>o.status==="pending").map(o=><option key={o.id} value={o.id}>#{o.id} {o.user}</option>)}
                  </select>
                }
                <select value="" onChange={e=>changeDroneStatus(index, e.target.value)}>
                  <option value="">⚙️ Trạng thái</option>
                  <option value="ready">Sẵn sàng</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="low_battery">Pin yếu</option>
                </select>
                <button onClick={()=>deleteDrone(index)}>❌ Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📦 Danh sách đơn hàng</h2>
      <table className="drones-table">
        <thead>
          <tr><th>ID</th><th>Cửa hàng</th><th>Khách hàng</th><th>Trạng thái</th><th>Drone</th><th>ETA</th></tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const drone = drones.find(d => d.name === order.drone);
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.store}</td>
                <td>{order.user}</td>
                <td>{translateOrderStatus(order.status)}</td>
                <td>{order.drone || "-"}</td>
                <td>{order.status==="delivering" && drone ? `${drone.eta}s` : "-"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="map-wrapper" style={{height:"400px", marginTop:"20px"}}>
        <MapContainer center={[10.779,106.702]} zoom={16} style={{height:"100%", width:"100%"}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.entries(storeLocations).map(([k,v])=><Marker key={k} position={v} icon={storeIcon} />)}
          {Object.entries(userLocations).map(([k,v])=><Marker key={k} position={v} icon={userIcon} />)}
          {orders.filter(o=>o.dronePos).map(o=>
            <Marker key={o.id} position={o.dronePos} icon={droneIcon}>
              <Popup>{o.drone} giao cho {o.user}</Popup>
            </Marker>
          )}
          {orders.filter(o=>o.dronePos).map(o=>
            <Polyline key={o.id} positions={[storeLocations[o.store], userLocations[o.user]]} color="blue"/>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneOrders;
