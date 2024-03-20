import mongoose from "mongoose";

const graphSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Graph = mongoose.model("Graph", graphSchema);

export default Graph;
