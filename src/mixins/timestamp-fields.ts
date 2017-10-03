
export = (Model) =>{
    Model.defineProperty('created_at', { type: Date, required: true, default: '$now' });
    Model.defineProperty('updated_at', { type: Date, required: true, default: '$now' });
}