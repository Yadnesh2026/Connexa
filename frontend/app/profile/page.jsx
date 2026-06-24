"use client";

import React, { useEffect, useMemo, useState } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../config/redux/action/authAction";
import { getAllPosts } from "../config/redux/action/postAction";
import { clientServer, getMediaUrl, handleImageError } from "../config";
import styles from "./styles.module.css";

const emptyWork = { company: "", position: "", years: "" };
const emptyEducation = { school: "", degree: "", feildofStudy: "" };

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [profileEdits, setProfileEdits] = useState({});
  const [workInput, setWorkInput] = useState(emptyWork);
  const [educationInput, setEducationInput] = useState(emptyEducation);
  const [userInput, setUserInput] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getAboutUser({ token }));
    }
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const userProfile = useMemo(() => {
    if (!authState.user?.userId) return null;

    return {
      ...authState.user,
      ...profileEdits,
    };
  }, [authState.user, profileEdits]);

  const userPosts = useMemo(() => {
    const username = userProfile?.userId?.username;
    if (!username) return [];

    return (postReducer.posts || []).filter(
      (post) => post.userId?.username === username,
    );
  }, [postReducer.posts, userProfile?.userId?.username]);

  const saveProfile = async (nextProfile, successText) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatusMessage("Please sign in again to update your profile.");
      return false;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      await clientServer.post("/update_profile_data", {
        token,
        bio: nextProfile.bio || "",
        currentPost: nextProfile.currentPost || "",
        pastwork: nextProfile.pastwork || [],
        education: nextProfile.education || [],
      });

      setProfileEdits({});
      await dispatch(getAboutUser({ token }));
      setStatusMessage(successText || "Profile updated successfully.");
      return true;
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Profile could not be updated.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileEdits((current) => ({ ...current, [name]: value }));
  };

  const openProfileEditor = () => {
    setUserInput({
      name: userProfile.userId?.name || "",
      username: userProfile.userId?.username || "",
      email: userProfile.userId?.email || "",
    });
    setIsProfileModalOpen(true);
  };

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput((current) => ({ ...current, [name]: value }));
  };

  const saveUserDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatusMessage("Please sign in again to update your profile.");
      return;
    }

    if (!userInput.name.trim() || !userInput.username.trim() || !userInput.email.trim()) {
      setStatusMessage("Name, username, and email are required.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      await clientServer.post("/user_update", {
        token,
        name: userInput.name.trim(),
        username: userInput.username.trim(),
        email: userInput.email.trim(),
      });

      await dispatch(getAboutUser({ token }));
      setIsProfileModalOpen(false);
      setStatusMessage("Profile details updated.");
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Profile details could not be updated.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    const token = localStorage.getItem("token");

    if (!file || !token) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage("Profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("profile", file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return previewUrl;
    });

    setIsSaving(true);
    setStatusMessage("");

    try {
      await clientServer.post("/upload_profile", formData);
      await dispatch(getAboutUser({ token }));
      setStatusMessage("Profile photo updated.");
      setPhotoPreviewUrl("");
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Profile photo could not be uploaded.",
      );
    } finally {
      setIsSaving(false);
      event.target.value = "";
    }
  };

  const handleAddWork = async () => {
    if (!workInput.company.trim() && !workInput.position.trim()) {
      setStatusMessage("Add company or position before saving work.");
      return;
    }

    const nextProfile = {
      ...userProfile,
      pastwork: [...(userProfile.pastwork || []), workInput],
    };

    const saved = await saveProfile(nextProfile, "Work experience added.");
    if (saved) {
      setWorkInput(emptyWork);
      setIsWorkModalOpen(false);
    }
  };

  const handleRemoveWork = async (indexToRemove) => {
    const nextProfile = {
      ...userProfile,
      pastwork: (userProfile.pastwork || []).filter(
        (_, index) => index !== indexToRemove,
      ),
    };

    await saveProfile(nextProfile, "Work experience removed.");
  };

  const handleAddEducation = async () => {
    if (!educationInput.school.trim() && !educationInput.degree.trim()) {
      setStatusMessage("Add school or degree before saving education.");
      return;
    }

    const nextProfile = {
      ...userProfile,
      education: [...(userProfile.education || []), educationInput],
    };

    const saved = await saveProfile(nextProfile, "Education added.");
    if (saved) {
      setEducationInput(emptyEducation);
      setIsEducationModalOpen(false);
    }
  };

  const handleRemoveEducation = async (indexToRemove) => {
    const nextProfile = {
      ...userProfile,
      education: (userProfile.education || []).filter(
        (_, index) => index !== indexToRemove,
      ),
    };

    await saveProfile(nextProfile, "Education removed.");
  };

  if (!userProfile?.userId) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className={styles.loadingState}>Loading your profile...</div>
        </DashBoardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <section className={styles.hero}>
            <button
              type="button"
              className={styles.editProfileButton}
              onClick={openProfileEditor}
            >
              Edit Profile
            </button>
            <div className={styles.coverImage}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.photoUpload}
              >
                Change Photo
              </label>
              <input
                type="file"
                id="profilePictureUpload"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              <img
                src={photoPreviewUrl || getMediaUrl(userProfile.userId.profilePicture)}
                onError={handleImageError}
                alt={userProfile.userId.name || "Profile"}
                className={styles.profilePhoto}
              />
            </div>

            <div className={styles.identity}>
              <div>
                <h1>{userProfile.userId.name}</h1>
                <p>@{userProfile.userId.username}</p>
              </div>
              <div className={styles.profileActions}>
                <label
                  htmlFor="profilePictureUpload"
                  className={styles.uploadButton}
                >
                  Upload Photo
                </label>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={isSaving}
                  onClick={() => saveProfile(userProfile)}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </section>

          {statusMessage && (
            <p className={styles.statusMessage}>{statusMessage}</p>
          )}

          <div className={styles.profileGrid}>
            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.eyebrow}>About</p>
                  <h2>Profile Details</h2>
                </div>
              </div>

              <label className={styles.field}>
                Current role
                <input
                  name="currentPost"
                  value={userProfile.currentPost || ""}
                  onChange={handleProfileFieldChange}
                  placeholder="Example: Frontend Developer"
                />
              </label>

              <label className={styles.field}>
                Bio
                <textarea
                  name="bio"
                  value={userProfile.bio || ""}
                  onChange={handleProfileFieldChange}
                  placeholder="Write a short profile bio"
                  rows={5}
                />
              </label>
            </section>

            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.eyebrow}>Activity</p>
                  <h2>Recent Posts</h2>
                </div>
                <span>{userPosts.length}</span>
              </div>

              {userPosts.length === 0 ? (
                <div className={styles.emptyState}>
                  Your recent posts will appear here.
                </div>
              ) : (
                <div className={styles.activityList}>
                  {userPosts.slice(0, 4).map((post) => (
                    <article key={post._id} className={styles.postCard}>
                      {post.media ? (
                        <img
                          src={getMediaUrl(post.media, "")}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className={styles.postPlaceholder} />
                      )}
                      <p>{post.body || "Post without text"}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Experience</p>
                <h2>Work Experience</h2>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setIsWorkModalOpen(true)}
              >
                Add Work
              </button>
            </div>

            {(userProfile.pastwork || []).length === 0 ? (
              <div className={styles.emptyState}>No work experience added.</div>
            ) : (
              <div className={styles.cardGrid}>
                {(userProfile.pastwork || []).map((work, index) => (
                  <article key={`${work.company}-${index}`} className={styles.infoCard}>
                    <div>
                      <h3>{work.position || "Position"}</h3>
                      <p>{work.company || "Company"}</p>
                      <span>{work.years || "Years not added"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWork(index)}
                      disabled={isSaving}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Learning</p>
                <h2>Education</h2>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setIsEducationModalOpen(true)}
              >
                Add Education
              </button>
            </div>

            {(userProfile.education || []).length === 0 ? (
              <div className={styles.emptyState}>No education added.</div>
            ) : (
              <div className={styles.cardGrid}>
                {(userProfile.education || []).map((education, index) => (
                  <article key={`${education.school}-${index}`} className={styles.infoCard}>
                    <div>
                      <h3>{education.degree || "Degree"}</h3>
                      <p>{education.school || "School"}</p>
                      <span>{education.feildofStudy || "Field of study"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      disabled={isSaving}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {isProfileModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsProfileModalOpen(false)}
          >
            <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
              <h2>Edit Profile</h2>
              <input
                className={styles.inputField}
                name="name"
                value={userInput.name}
                onChange={handleUserInputChange}
                placeholder="Name"
              />
              <input
                className={styles.inputField}
                name="username"
                value={userInput.username}
                onChange={handleUserInputChange}
                placeholder="Username"
              />
              <input
                className={styles.inputField}
                name="email"
                type="email"
                value={userInput.email}
                onChange={handleUserInputChange}
                placeholder="Email"
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={saveUserDetails}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isWorkModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsWorkModalOpen(false)}
          >
            <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
              <h2>Add Work Experience</h2>
              <input
                className={styles.inputField}
                name="company"
                value={workInput.company}
                onChange={(event) =>
                  setWorkInput({ ...workInput, company: event.target.value })
                }
                placeholder="Company"
              />
              <input
                className={styles.inputField}
                name="position"
                value={workInput.position}
                onChange={(event) =>
                  setWorkInput({ ...workInput, position: event.target.value })
                }
                placeholder="Position"
              />
              <input
                className={styles.inputField}
                name="years"
                value={workInput.years}
                onChange={(event) =>
                  setWorkInput({ ...workInput, years: event.target.value })
                }
                placeholder="Years"
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={() => setIsWorkModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleAddWork}
                  disabled={isSaving}
                >
                  Add Work
                </button>
              </div>
            </div>
          </div>
        )}

        {isEducationModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsEducationModalOpen(false)}
          >
            <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
              <h2>Add Education</h2>
              <input
                className={styles.inputField}
                value={educationInput.school}
                onChange={(event) =>
                  setEducationInput({
                    ...educationInput,
                    school: event.target.value,
                  })
                }
                placeholder="School"
              />
              <input
                className={styles.inputField}
                value={educationInput.degree}
                onChange={(event) =>
                  setEducationInput({
                    ...educationInput,
                    degree: event.target.value,
                  })
                }
                placeholder="Degree"
              />
              <input
                className={styles.inputField}
                value={educationInput.feildofStudy}
                onChange={(event) =>
                  setEducationInput({
                    ...educationInput,
                    feildofStudy: event.target.value,
                  })
                }
                placeholder="Field of study"
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={() => setIsEducationModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleAddEducation}
                  disabled={isSaving}
                >
                  Add Education
                </button>
              </div>
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}
