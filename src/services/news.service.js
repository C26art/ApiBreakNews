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
    title: { $regex: `${ title || "" }`, $options: "i" }
}).sort({ _id: -1 }).populate("user");

export const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user");

export const updateService = (id, title, text, banner) => News.findOneAndUpdate({ _id: id }, { title, text, banner }, { rawResult: true });
