pub mod custom_structures {
    #[derive(serde::Serialize)]
    pub struct ObjectWithTitleAndPath {
        pub title: String,
        pub path: String,
    }

    impl ObjectWithTitleAndPath {
        pub fn vec_from(titles: &Vec<String>, pathes: &Vec<String>) -> Vec<Self> {
            let mut vec = Vec::<Self>::new();
            for i in 0..titles.len() {
                vec.push(ObjectWithTitleAndPath{title: titles[i].clone(), path: pathes[i].clone()});
            }
            vec
        }

        pub fn from(title: &String, path: &String) -> Self {
            ObjectWithTitleAndPath{title: title.clone(), path: path.clone()}
        }
    }
}
