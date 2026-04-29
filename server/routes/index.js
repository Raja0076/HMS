import express from 'express'
import authRoutes from '../routes/Auth.routes.js'
import userRoutes from '../routes/User.routes.js'
import residentRoutes from '../routes/Resident.routes.js'
import buildingRoutes from '../routes/Building.routes.js'
import floorRoutes from '../routes/Floor.routes.js'
import roomRoutes from '../routes/Room.routes.js'


const registerRoutes = (app) => {
  app.use("/api/auth",      authRoutes);
  app.use("/api/users",     userRoutes);
  app.use("/api/residents", residentRoutes);
  app.use("/api/buildings", buildingRoutes);
  app.use("/api/floors",    floorRoutes);
  app.use("/api/rooms",     roomRoutes);
 
  // Catch-all for undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
  });
};
 
module.exports = { registerRoutes };