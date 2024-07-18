import { Router } from "express";
const router = Router(); 

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
})

router.get("/home", async (req, res) => {
    
    res.render("home");
})

export default router;