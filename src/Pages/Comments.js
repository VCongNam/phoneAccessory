// Comment.js
import React, { useEffect, useState } from "react";
import { Card, Rate, Button, Input, message } from "antd";
import { supabase } from "../supabaseClient"; // Adjust path if needed

const { TextArea } = Input;

const Comment = ({ productId, user }) => {
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingFeedback, setExistingFeedback] = useState(null);

    // Fetch all comments for the product
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comment")
            .select("*")
            .eq("product_id", productId);

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            setComments(data);

            // Check if user has already provided feedback
            if (user) {
                const userComment = data.find(comment => comment.user_id === user.user_id);
                if (userComment) {
                    setExistingFeedback(userComment);
                    setRating(userComment.rate);
                    setFeedback(userComment.feedback);
                }
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [productId, user]);

    const handleSubmitFeedback = async () => {
        if (!user) {
            message.warning("Please log in to submit feedback.");
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase
            .from("comment")
            .insert({ product_id: productId, user_id: user.user_id, rate: rating, feedback });

        if (error) {
            console.error("Error submitting feedback:", error);
            message.error("Failed to submit feedback.");
        } else {
            message.success("Feedback submitted successfully!");
            setFeedback("");
            setRating(0);
            fetchComments(); // Refresh comments after submission
        }

        setIsSubmitting(false);
        window.location.reload();
    };

    return (
        <div>
            {/* Show feedback form only if user is logged in and hasn't already left feedback */}
            {user && !existingFeedback ? (
                <div style={{ marginTop: "20px" }}>
                    <Rate onChange={(value) => setRating(value)} value={rating} /><br />
                    <TextArea
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="viết đánh giá của bạn..."
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmitFeedback}
                        loading={isSubmitting}
                    >
                        Submit Feedback
                    </Button>
                </div>
            ) : (
                <p>{!user ? "Đăng nhập trước khi thêm đánh giá." : "Bạn đã thêm đánh giá cho sản phẩm này."}</p>
            )}
            <h3 style={{ marginTop: "20px",textAlign:"center" }}>Đánh giá sản phẩm</h3>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Card key={comment.id} hoverable style={{ marginBottom: "16px" }}>
                        <div>
                            <strong>{comment.user_id}</strong>
                            <Rate disabled value={comment.rate} />
                            <p><strong>Feedback:</strong> {comment.feedback}</p>
                        </div>
                    </Card>
                ))
            ) : (
                <p>Chưa có đnáh giá cho sản phẩm này. Hãy trờ thành người đầu tiên đánh giá sản phẩm!</p>
            )}


        </div>
    );
};

export default Comment;
