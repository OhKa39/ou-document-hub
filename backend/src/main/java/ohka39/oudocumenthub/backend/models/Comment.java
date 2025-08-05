package ohka39.oudocumenthub.backend.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID commentId;

    @Column(name = "parent_id")
    private UUID parentId;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "is_edit")
    private boolean isEdit;

    private String detail;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    @OneToMany(mappedBy = "comment")
    private List<CommentImage> commentImages;

    @Column(name = "is_delete")
    private boolean isDelete;

    @Column(nullable = false)
    private int lft;

    @Column(nullable = false)
    private int rgt;

    @Column(name = "rating")
    private int rating;
    @Column(name = "likes")
    private int likes;
}
