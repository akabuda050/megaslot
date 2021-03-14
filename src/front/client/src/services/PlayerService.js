import api from "@/services/api";

export default {
  createPlayer({ playerId }) {
    return api().post("/api/v1/players/create-player", { playerId });
  },
  deposit({ playerId }) {
    return api().post("/api/v1/players/deposit", { playerId });
  },
  withdrawal({ playerId }) {
    return api().post("/api/v1/players/withdrawal", { playerId });
  },
};
