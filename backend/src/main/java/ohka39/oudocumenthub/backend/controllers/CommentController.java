package ohka39.oudocumenthub.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("${api-route}/comments")
public class CommentController {
    // private final ICommentService commentService;

    @PostMapping
    public String postMethodName(@RequestBody String entity) {
        // TODO: process POST request

        return entity;
    }

}
