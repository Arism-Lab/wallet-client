import { Document, Schema, model, models } from 'mongoose'

export interface IMetadata extends Document, Metadata {}

const MetadataSchema = new Schema<IMetadata>(
    {
        user: { type: String, required: true },
        devices: {
            type: Array<Device>(),
            required: true,
            default: [],
        },
        recoveryKey: { type: String, required: true },
        privateIndices: {
            type: Array<PrivateIndex>(),
            required: true,
            default: [],
        },
    },
    { timestamps: true }
)

const Metadata = models.Metadata || model<IMetadata>('Metadata', MetadataSchema)

export default Metadata
