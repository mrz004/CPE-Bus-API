const fs = require("fs");
const express = require("express");
const app = express();
const { key, buses } = JSON.parse(fs.readFileSync("data.json", { "encoding": "utf-8" }));

const auth = ({query}, res, next) => {
  // return true;
  if (query.key !== key)
    res.status(401).send("Access Denaied!")
  else
    next();
}
const updateBus = (id, cods) => {
  buses[id] = cods;
  fs.writeFileSync("data.json", JSON.stringify({ key, buses }, null, 4));
}


app.use(express.json());
app.use("/api", auth);

app.get("/api", ({ query: { id } }, res) => {
  if (!id)
    res.send(buses);
  else if (!buses.hasOwnProperty(id)) {
    res.send("key not found!");
    comsole.log(id)
  }
  else
    res.send(buses[id])
})

app.get("/api/set", ({query: {id, lon, lat}}, res) => {
  if (!id || !lon || !lat) res.send("incomplete request!");
  else if (!buses.hasOwnProperty(id))
    res.send("key not found!");
  else {
    const myLon = Number.parseFloat(lon)
    const myLat = Number.parseFloat(lat);
    if(isNaN(lon) || isNaN(lat)){
      res.send("parameter type mismatched!");
    }
    else {
    updateBus(id, {myLon, myLat});
    res.send("done");
    }
  }
});

app.listen(port=33000,(err)=>{console.log("Server Started! at http://localhost:33000/")});
