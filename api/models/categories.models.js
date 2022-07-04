

exports.getCategories = (req, res, next) => {
    selectAllCategories().then((categoriesArr) => {
        res.status(200).send(categoriesArr);
    })
}