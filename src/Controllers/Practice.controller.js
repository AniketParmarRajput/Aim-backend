import Practice from "../Model/Practice.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dviokng6d",
  api_key: "187969885516314",
  api_secret: "qGctzEPVAxK9UDeiqQqJIEUfhwk",
});

const uploadToCloudinary = async (file, folder = "PraticalQuestion") => {
  if (!file) return null;
  const b64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(b64, {
    folder,
    resource_type: "auto",
  });
  return result.secure_url;
};

const pickFile = (files, field) => files?.[field]?.[0] || null;

// ============ PRACTICE CRUD (Admin only) - SINGLE TABLE PraticalQuestion ============
const calcNextAvailable = (from, cooldown) => {
  const d = from ? new Date(from) : new Date();
  if (cooldown === "1week") d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 1);
  return d;
};

export const addPractice = async (req, res) => {
  try {
    const { category, question, description, questionType, solution, cooldown, questionImageUrl, questionPdfUrl, questionVideoUrl, solutionImageUrl, solutionPdfUrl, solutionVideoUrl } = req.body;
    if (!category || !question || !description) {
      return res.status(400).json({ success: false, message: "category, question and description are required" });
    }
    const type = questionType && ["practical", "theory"].includes(questionType) ? questionType : "practical";
    const cd = cooldown && ["1day", "1week"].includes(cooldown) ? cooldown : "1day";

    const files = req.files || {};
    // Question media
    let questionImage = questionImageUrl || null;
    let questionPdf = questionPdfUrl || null;
    let questionVideo = questionVideoUrl || null;
    // Solution media
    let solutionImage = solutionImageUrl || null;
    let solutionPdf = solutionPdfUrl || null;
    let solutionVideo = solutionVideoUrl || null;

    const qImgFile = pickFile(files, "questionImage");
    const qPdfFile = pickFile(files, "questionPdf");
    const qVidFile = pickFile(files, "questionVideo");
    const sImgFile = pickFile(files, "solutionImage");
    const sPdfFile = pickFile(files, "solutionPdf");
    const sVidFile = pickFile(files, "solutionVideo");

    if (qImgFile) questionImage = await uploadToCloudinary(qImgFile);
    if (qPdfFile) questionPdf = await uploadToCloudinary(qPdfFile);
    if (qVidFile) questionVideo = await uploadToCloudinary(qVidFile);
    if (sImgFile) solutionImage = await uploadToCloudinary(sImgFile);
    if (sPdfFile) solutionPdf = await uploadToCloudinary(sPdfFile);
    if (sVidFile) solutionVideo = await uploadToCloudinary(sVidFile);

    const practice = await Practice.create({
      category,
      question,
      description,
      questionType: type,
      solution: solution || null,
      status: "pending",
      cooldown: cd,
      nextAvailableAt: null,
      questionImage,
      questionPdf,
      questionVideo,
      solutionImage,
      solutionPdf,
      solutionVideo,
    });
    return res.status(201).json({ success: true, message: "PraticalQuestion created", data: practice });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPractices = async (req, res) => {
  try {
    const { questionType, category, status } = req.query;
    const where = {};
    if (questionType && ["practical", "theory"].includes(questionType)) where.questionType = questionType;
    if (category) where.category = category;
    if (status) where.status = status;
    const practices = await Practice.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, data: practices });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPracticeById = async (req, res) => {
  try {
    const p = await Practice.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "PraticalQuestion not found" });
    return res.status(200).json({ success: true, data: p });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePractice = async (req, res) => {
  try {
    const p = await Practice.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "PraticalQuestion not found" });
    const { category, question, description, questionType, solution, status, active, completedAt, cooldown, nextAvailableAt, questionImageUrl, questionPdfUrl, questionVideoUrl, solutionImageUrl, solutionPdfUrl, solutionVideoUrl } = req.body;
    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (question !== undefined) updateData.question = question;
    if (description !== undefined) updateData.description = description;
    if (questionType !== undefined && ["practical", "theory"].includes(questionType)) updateData.questionType = questionType;
    if (solution !== undefined) updateData.solution = solution;
    if (cooldown !== undefined && ["1day", "1week"].includes(cooldown)) updateData.cooldown = cooldown;
    if (nextAvailableAt !== undefined) updateData.nextAvailableAt = nextAvailableAt || null;
    if (status !== undefined && ["pending", "completed"].includes(status)) {
      updateData.status = status;
      if (status === "completed" && !p.completedAt) {
        const now = new Date();
        updateData.completedAt = now;
        updateData.nextAvailableAt = calcNextAvailable(now, updateData.cooldown || p.cooldown);
      }
      if (status === "pending") {
        updateData.completedAt = null;
        updateData.nextAvailableAt = null;
      }
    }
    if (active !== undefined) updateData.active = active;
    if (completedAt !== undefined) updateData.completedAt = completedAt;

    const files = req.files || {};
    const fieldMap = {
      questionImage: "questionImage",
      questionPdf: "questionPdf",
      questionVideo: "questionVideo",
      solutionImage: "solutionImage",
      solutionPdf: "solutionPdf",
      solutionVideo: "solutionVideo",
    };
    for (const [field, col] of Object.entries(fieldMap)) {
      const f = pickFile(files, field);
      if (f) {
        updateData[col] = await uploadToCloudinary(f);
      } else {
        // allow URL override via body
        const urlKey = field + "Url";
        if (req.body[urlKey] !== undefined) updateData[col] = req.body[urlKey] || null;
      }
    }
    // also handle direct URL fields without file
    if (questionImageUrl !== undefined && !updateData.questionImage) updateData.questionImage = questionImageUrl || null;
    if (questionPdfUrl !== undefined && !updateData.questionPdf) updateData.questionPdf = questionPdfUrl || null;
    if (questionVideoUrl !== undefined && !updateData.questionVideo) updateData.questionVideo = questionVideoUrl || null;
    if (solutionImageUrl !== undefined && !updateData.solutionImage) updateData.solutionImage = solutionImageUrl || null;
    if (solutionPdfUrl !== undefined && !updateData.solutionPdf) updateData.solutionPdf = solutionPdfUrl || null;
    if (solutionVideoUrl !== undefined && !updateData.solutionVideo) updateData.solutionVideo = solutionVideoUrl || null;

    await p.update(updateData);
    return res.status(200).json({ success: true, message: "Updated", data: p });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePractice = async (req, res) => {
  try {
    const p = await Practice.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "PraticalQuestion not found" });
    await p.destroy();
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============ DAILY 2 QUESTIONS - SINGLE TABLE PraticalQuestion ============
export const getDailyPractices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "2", 10);
    const where = { active: true };
    if (req.query.questionType) where.questionType = req.query.questionType;
    const all = await Practice.findAll({ where, order: [["createdAt", "ASC"]] });
    if (all.length === 0) return res.status(200).json({ success: true, data: [], message: "No PraticalQuestion yet" });

    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) % 100000;
    const offset = all.length > limit ? hash % all.length : 0;

    const daily = [];
    for (let i = 0; i < Math.min(limit, all.length); i++) {
      daily.push(all[(offset + i) % all.length]);
    }

    const annotated = daily.map((p) => {
      const j = p.toJSON();
      j.completed = j.status === "completed";
      return j;
    });

    return res.status(200).json({ success: true, data: annotated, date: today });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============ SINGLE TABLE SUBMIT / TRACKING - PraticalQuestion with 1day/1week choice ============
export const submitPractice = async (req, res) => {
  try {
    const { practiceId, id, userId, userEmail, solution, cooldown, solutionImageUrl, solutionPdfUrl, solutionVideoUrl } = req.body;
    const pid = practiceId || id;
    if (!pid) return res.status(400).json({ success: false, message: "practiceId required" });
    const chosenCooldown = cooldown && ["1day", "1week"].includes(cooldown) ? cooldown : null;

    const practice = await Practice.findByPk(pid);
    if (!practice) return res.status(404).json({ success: false, message: "PraticalQuestion not found" });

    if (practice.status === "completed") {
      return res.status(200).json({ success: true, message: "Already completed", data: practice });
    }

    const files = req.files || {};
    const sImgFile = pickFile(files, "solutionImage");
    const sPdfFile = pickFile(files, "solutionPdf");
    const sVidFile = pickFile(files, "solutionVideo");

    let solutionImage = practice.solutionImage;
    let solutionPdf = practice.solutionPdf;
    let solutionVideo = practice.solutionVideo;

    if (sImgFile) solutionImage = await uploadToCloudinary(sImgFile);
    else if (solutionImageUrl !== undefined) solutionImage = solutionImageUrl || null;
    if (sPdfFile) solutionPdf = await uploadToCloudinary(sPdfFile);
    else if (solutionPdfUrl !== undefined) solutionPdf = solutionPdfUrl || null;
    if (sVidFile) solutionVideo = await uploadToCloudinary(sVidFile);
    else if (solutionVideoUrl !== undefined) solutionVideo = solutionVideoUrl || null;

    const now = new Date();
    const finalCooldown = chosenCooldown || practice.cooldown || "1day";
    await practice.update({
      status: "completed",
      solution: solution !== undefined ? solution : practice.solution,
      solutionImage,
      solutionPdf,
      solutionVideo,
      completedAt: now,
      cooldown: finalCooldown,
      nextAvailableAt: calcNextAvailable(now, finalCooldown),
      completedByEmail: userEmail || null,
      completedById: userId || null,
    });

    return res.status(200).json({ success: true, message: "Marked as completed", data: practice });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const { userEmail, userId } = req.query;
    const where = { status: "completed" };
    if (userEmail) where.completedByEmail = userEmail;
    if (userId) where.completedById = userId;
    const subs = await Practice.findAll({ where, order: [["completedAt", "DESC"]] });
    const shaped = subs.map((p) => ({
      id: p.id,
      practiceId: p.id,
      userEmail: p.completedByEmail,
      userId: p.completedById,
      status: p.status,
      solution: p.solution,
      completedAt: p.completedAt,
      createdAt: p.createdAt,
      practice: p,
    }));
    return res.status(200).json({ success: true, data: shaped });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const subs = await Practice.findAll({ where: { status: "completed" }, order: [["completedAt", "DESC"]] });
    const shaped = subs.map((p) => ({
      id: p.id,
      practiceId: p.id,
      userEmail: p.completedByEmail,
      userId: p.completedById,
      status: p.status,
      solution: p.solution,
      completedAt: p.completedAt,
      createdAt: p.createdAt,
      practice: p,
    }));
    return res.status(200).json({ success: true, data: shaped });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPractice = async (req, res) => {
  try {
    const p = await Practice.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "PraticalQuestion not found" });
    await p.update({ status: "pending", completedAt: null, nextAvailableAt: null, completedByEmail: null, completedById: null });
    return res.status(200).json({ success: true, data: p });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { addPractice, getPractices, getPracticeById, updatePractice, deletePractice, getDailyPractices, submitPractice, getMySubmissions, getAllSubmissions, resetPractice };
