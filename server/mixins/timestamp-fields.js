"use strict";
module.exports = function (Model) {
    Model.defineProperty('created_at', { type: Date, required: true, "default": '$now' });
    Model.defineProperty('updated_at', { type: Date, required: true, "default": '$now' });
};
//# sourceMappingURL=timestamp-fields.js.map