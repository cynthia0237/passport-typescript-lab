import express, { Request, Response } from "express";
import { ensureAdmin } from "../middleware/checkAuth";

const router = express.Router();

router.get("/", ensureAdmin, (req: Request, res: Response) => {
  if (!req.sessionStore?.all) {
    return res.status(500).send("Session not available");
  }
  req.sessionStore.all((err: any, sessions: any) => {
    if (err) {
      console.log(err);
      return res.status(500).send("500 Internal Server Error");
    }
    const sessionData = Object.entries(sessions).map(([sid, session]: any) => ({
      id: sid,
      userId: session.passport?.user,
    }));

    res.render("admin", { sessions: sessionData });
  });
});

router.post("/revoke/:id", ensureAdmin, (req: Request, res: Response) => {
  const sessionId = req.params.id;

  req.sessionStore.destroy(sessionId, (err: any) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error 500");
    }

    res.redirect("/admin");
  });
});

export default router;
