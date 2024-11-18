use surrealdb::sql::Thing;

pub struct OutputValue {
    pub id: Thing,
    pub input_parameter_name: String,
    pub output_parameter_name: String,
    pub value: String,
}

pub struct InputParameter {
    pub id: Thing,
    pub name: String,
    pub crop_id: Thing,
    pub values: String,
}

pub struct OutputParameter {
    pub id: Thing,
    pub name: String,
    pub crop_id: u32,
}

pub struct Crop {
    pub id: Thing,
    pub harvester_id: u32,
    pub name: String,
    pub image: String,
    pub image_format: String,
}

pub struct Harvester {
    pub id: u32,
    pub name: String,
    pub image: String,
    pub image_format: String,
}