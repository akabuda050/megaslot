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
  saveSlot({ playerId, slotId, data }) {
    return api().post("/api/v1/slots/save", {
      playerId,
      slotId,
      data,
    });
  },
  deleteSlot({ playerId, slotId }) {
    return api().post("/api/v1/slots/delete", {
      playerId,
      slotId,
    });
  },
  checkSlotRTP({ playerId, slotId }) {
    return api().post("/api/v1/slots/check-rtp", {
      playerId,
      slotId,
    });
  },
};
