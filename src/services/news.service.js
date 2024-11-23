import News from "../models/News.js";

/**
 * Cria uma nova notícia no banco de dados.
 * @param {Object} body - Dados da notícia.
 * @returns {Promise<Object>} - Notícia criada.
 */
export const createService = async (body) => {
    return await News.create(body);
};

/**
 * Busca todas as notícias com paginação e ordenação.
 * @param {number} offset - Ponto inicial para a busca.
 * @param {number} limit - Número máximo de resultados.
 * @returns {Promise<Array>} - Lista de notícias.
 */
export const findAllService = async (offset, limit) => {
    return await News.find()
        .sort({ _id: -1 }) // Ordena em ordem decrescente por ID
        .skip(offset) // Ignora os primeiros `offset` documentos
        .limit(limit) // Limita a busca a `limit` documentos
        .populate("user"); // Popula o campo de referência ao usuário
};

/**
 * Conta o número total de notícias no banco de dados.
 * @returns {Promise<number>} - Número total de documentos.
 */
export const countNews = async () => {
    return await News.countDocuments();
};

export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user");

export const searchByTitleService = (title) => News.find({
    title: { $regex: `${title || ""}`, $options: "i" }
}).sort({ _id: -1 }).populate("user");

export const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user");

export const updateService = (id, title, text, banner) => News.findOneAndUpdate({ _id: id }, { title, text, banner }, { rawResult: true });

export const eraseService = (id) => News.findByIdAndDelete({ _id: id });

export const likeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews, "likes.userId": { $nin: [userId] } }, { $push: { likes: { userId, createdAt: new Date() }, }, }
);

export const deleteLikeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews }, { $pull: { likes: { userId } } }
);

export const addCommentService = (idNews, comment, userId) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36);
    return News.findOneAndUpdate({ _id: idNews }, { $push: { comments: { idComment, userId, comment, createdAt: new Date() },},} );
}

export const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate({ _id: idNews }, { $pull: { comments: { idComment, userId },},});