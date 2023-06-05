import NotFoundError from "../errors/not-found.error.js";
import ApiFeatures from "../utils/ApiFeatures.js";

//desc global code for  delete document that take model
export const deleteOne = (Model) => async (req, res) => {
  const { id } = req.params;
  //const document = await Model.({ _id: id });
  const document = await Model.findByIdAndDelete(id);
  if (!document) {
    throw new NotFoundError("document with this id is not found", 404);
  }

  res.status(200).json({ message: "document is deleted" });
};

//desc global code for update document that take model
export const updateOne = (Model) => async (req, res) => {
  const { id } = req.params;
  const document = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  document.save();
  if (!document) {
    throw new NotFoundError("document with this id is not found");
  }
  res.status(200).json({ data: document });
};

//@desc global code for get single document take model and name of model to
//@decs run specific functionlity for products to populate category
export const getOne = (Model, populateOpt) => async (req, res) => {
  const { id } = req.params;
  let filter = { _id: id };
  if (req.filterObj) {
    filter = { _id: id, ...req.filterObj };
  }
  let mongooseQuery = Model.findOne(filter);

  if (populateOpt) {
    mongooseQuery = mongooseQuery.populate(populateOpt);
  }
  const document = await mongooseQuery;
  if (!document) {
    throw new NotFoundError("document with this id is not found");
  }
  res.status(200).json({ data: document });
};

export const createOne = (Model) => async (req, res) => {
  console.log(req.body);
  const newDocument = await Model.create(req.body);
  newDocument.save();
  res.status(201).json({ data: newDocument });
};

//@desc global code to get list of ducments take model and model name to
//@decs run specific functionlity for products to populate category
export const getList = (Model) => async (req, res) => {
  const documentCount = await Model.countDocuments();
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .search("Products")
    .limitFields()
    .sort()
    .pagenate(documentCount);

  const { mongooseQuery, pageResulte } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ result: documents.length, pageResulte, data: documents });
};
