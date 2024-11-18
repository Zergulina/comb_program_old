import { invoke } from "@tauri-apps/api/tauri";

export default class FileService {
    static initJsonFiles = async (callback) => {

        try {
            const result = await invoke('init_json_files');
            let vec = [];
            result.forEach((file) => {
                let imageUrl = `data:image/${file.image.file_format};base64,${file.image.encoded}`;
                vec.push({ title: file.title, imageUrl: imageUrl });
            })
            callback(vec);
        }
        catch (error) {
            console.error('Json open error:', error);
        }
    }

    static selectImage = (callback) => {
        invoke('select_image', {}).then((response) => {
            callback(response);
        });
    }

    static addComb = (title, imgPath, callback) => {
        if (title != "" && imgPath != "") {
            invoke('create_new_comb', { title, imgPath }).then((file) => {
                if (file) {
                    callback({ title: file.title, imageUrl: `data:image/${file.image.file_format};base64,${file.image.encoded}` });
                }
            })
        }
    }

    static deleteComb = (titleToDelete, callback) => {
        invoke('delete_file_from_json', { titleToDelete }).then(() => {
            callback(titleToDelete);
        });
    }

    static editComb = (titleToEdit, newTitle, newImgPath, callback) => {
        invoke('edit_file_from_json', { titleToEdit, newTitle, newImgPath }).then(response => {
            let imageUrl = `data:image/${response.file_format};base64,${response.encoded}`;
            callback(newTitle, imageUrl)
        })
    }

    static getCropCards = (combTitle, callback) => {
        invoke('get_crop_cards', { combTitle }).then(response => {
            let vec = [];
            response.forEach((card) => {
                let imageUrl = `data:image/${card.image.file_format};base64,${card.image.encoded}`;
                vec.push({ title: card.title, imageUrl: imageUrl });
            })
            callback(vec);
        })
    }

    static addCrop = (combTitle, cropTitle, imgPath, callback) => {
        if (cropTitle != "" && imgPath != "") {
            invoke('create_new_crop', { combTitle, cropTitle, imgPath }).then(response => {
                callback({ title: response.title, imageUrl: `data:image/${response.image.file_format};base64,${response.image.encoded}` });
            })
        }
    }

    static deleteCrop = (combTitle, cropTitleToDelete, callback) => {
        invoke('delete_crop', { combTitle, cropTitleToDelete }).then(() => {
            callback(cropTitleToDelete);
        });
    }

    static editCrop = (combTitle, cropTitleToEdit, newTitle, newImgPath, callback) => {
        invoke('edit_crop', { combTitle, cropTitleToEdit, newTitle, newImgPath }).then(response => {
            let imageUrl = `data:image/${response.file_format};base64,${response.encoded}`;
            callback(newTitle, imageUrl)
        });
    }

    static getCropData = (combTitle, cropTitle, callback) => {
        invoke('get_crop_data', { combTitle, cropTitle }).then(response => {
            callback(response)
        })
    }

    static setCropData = (combTitle, cropTitle, cropData) => {
        invoke('set_crop_data', { combTitle, cropTitle, cropData });
    }
}