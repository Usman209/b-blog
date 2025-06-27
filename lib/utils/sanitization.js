const Joi = require("joi");

exports.userRegisterSchemaValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),

  role: Joi.string().optional(), // Enum check can be added if needed
  gender: Joi.string().optional(), // Enum check can be added if needed
  bio: Joi.string().optional(),
  profileImg: Joi.string().optional(),
  lastLogin: Joi.date().optional(),
  emailVerified: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional()
});


exports.userLoginSchemaValidator = Joi.object({
  email: Joi.string().optional(),
  password: Joi.string().required(),
  versionNo: Joi.string().optional(),
  isMobile:Joi.string().optional(),
})

exports.updateProfileSchemaValidator = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional().min(11),
  ucmo: Joi.string().allow(null).optional(), // Allow ucmo to be a string or null
  aic: Joi.string().allow(null).optional(), // Allow ucmo to be a string or null  tehsilOrTown:Joi.string().optional(),
  isEmployee:Joi.boolean().optional(),
  gender:Joi.string().optional(),
  role: Joi.string().optional(),
  cnic: Joi.string().optional(),
  password: Joi.string().optional(),
  

  address: Joi.object({ // Inline definition of address schema
    street: Joi.string().allow(null, '').optional(),
    city: Joi.string().allow(null, '').optional(),
    state: Joi.string().allow(null, '').optional(),
    zip: Joi.string().allow(null, '').optional(), // Adjust as needed
    country: Joi.string().allow(null, '').optional(),
  }).optional(), 
  createdBy:Joi.string().optional(),
  updatedBy:Joi.string().optional(),
  deletedBy:Joi.string().optional(),

  status:Joi.string().optional(),

  territory: Joi.object({ // Inline definition of address schema
    division: Joi.string().allow(null, '').optional(),
    district: Joi.string().allow(null, '').optional(),
    uc: Joi.string().allow(null, '').optional(),
    tehsilOrTown: Joi.string().allow(null, '').optional(), // Adjust as needed
  }).optional(), 

  siteType: Joi.string().allow(null, '').optional(),

})

exports.createStaffSchemaValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('STAFF').required(),
  profileImg:Joi.string(),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      fileUrls: Joi.array().items(Joi.string()).min(1).required(),
    })
  ),
  qualifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      fileUrls: Joi.array().items(Joi.string()).min(1).required(),
    })
  ),
  businessId: Joi.string().required(),
  serviceId: Joi.string().required()

});

exports.updateStaffSchemaValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('STAFF').required(),
  profileImg:Joi.string(),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      fileUrls: Joi.array().items(Joi.string()).min(1).required(),
    })
  ),
  qualifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      fileUrls: Joi.array().items(Joi.string()).min(1).required(),
    })
  ),
  businessId: Joi.string().required(),
  serviceId: Joi.string().required()

});

exports.updatePasswordSchemaValidator = Joi.object({
  newpassword: Joi.string().required(),
})

exports.createServiceSchemaValicator = Joi.object( {
  name: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
  subServices: Joi.array().items( Joi.string() ).default( [] ),
  availability: Joi.string(),
  image: Joi.string(),
  review: Joi.string(),
  businessId: Joi.string().required(),
  createdBy: Joi.string(),
  updatedBy: Joi.string(),
  deletedBy: Joi.string(),
  isDeleted: Joi.string()
} ).unknown( true );

