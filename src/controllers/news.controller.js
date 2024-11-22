import { createService, findAllService, countNews, topNewsService, findByIdService, searchByTitleService, byUserService, updateService } from "../services/news.service.js";

export const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            return res.status(400).send({ message: "Submit all fields for registration." });
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId,
        });

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = parseInt(limit) > 0 ? parseInt(limit) : 5;
        offset = parseInt(offset) >= 0 ? parseInt(offset) : 0;

        const news = await findAllService(offset, limit);
        const total = await countNews();
        const currentUrl = req.baseUrl;


        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit >= 0 ? offset - limit : null;
        const previousUrl = previous !== null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;


        if (news.length === 0) {
            return res.status(204).send();
        }


        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                user: {
                    name: item.user.name,
                    username: item.user.username,
                    avatar: item.user.avatar,
                },
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There is not registered post." });
        }

        res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                user: {
                    name: item.user.name,
                    username: item.user.username,
                    avatar: item.user.avatar,
                },
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await findByIdService(id).populate("user");

        if (!news) {
            return res.status(404).send({ message: "Post not found." });
        }

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                user: news.user
                    ? {
                          name: news.user.name,
                          username: news.user.username,
                          avatar: news.user.avatar,
                      }
                    : null,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const newsList = await searchByTitleService(title).populate("user");

        if (newsList.length === 0) {
            return res.status(404).send({ message: "There are no posts with this title." });
        }

        return res.send({
            results: newsList.map((news) => ({
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                user: news.user
                    ? {
                          name: news.user.name,
                          username: news.user.username,
                          avatar: news.user.avatar,
                      }
                    : null,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const newsList = await byUserService(id);

        return res.send({
            results: newsList.map((news) => ({
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                user: news.user
                    ? {
                          name: news.user.name,
                          username: news.user.username,
                          avatar: news.user.avatar,
                      }
                    : null,
            })),
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if(!title && !text && !banner) {
            res.status(400).send({ message: "Submit at least one field to update the post." });
        }

        const news = await findByIdService(id);

        if(news.user._id != req.userId){
            res.status(400).send({ message: "You didn't update this post." });
        }

        await updateService(id, title, text, banner);

        return res.send({ message: "Post successfully update."});

    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};
