import api from "@/services/api";

export default {
  getSlots({ playerId }) {
    return api().post("/api/v1/slots/all", {
      playerId,
    });
  },
  getSlot({ playerId, slotId }) {
    return api().post("/api/v1/slots/get", {
      playerId,
      slotId,
    });
  },
  prepareGame({ playerId, slotId }) {
    return api().post("/api/v1/slots/prepareGame", {
      playerId,
      slotId,
    });
  },
  spin({ playerId, bid, slotId }) {
    return api().post("/api/v1/slots/spin", {
      playerId,
      bid,
      slotId,
    });
  },
};
