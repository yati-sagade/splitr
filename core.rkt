(define (sum xs)
  (foldl + 0.0 xs))

(define (get-share contribs)
  (/ (sum (map second contribs)
          (length contribs))))

(define (result-tuple from to amt)
  `(,(first from) -> ,(first to) ,amt))

(define (adjusted-contribs contribs)
  (let ([share (get-share contribs)])
    (map (lambda (c)
           (list (first c)
                 (- (second c)
                    share)))
         contribs)))

(define (filter-by-balance f contribs)
  (filter (lambda (c)
            (f (second c)))
          contribs))

(define (desc-by-balance contribs)
  (sort contribs
        (lambda (a b)
          (> (second a)
             (second b)))))

(define (separate-parties contribs)
  (let* ([part (partition (lambda (c)
                            (positive? (second c)))
                          contribs)])
    (list (first part)
          (map abs (second part)))))

(define (settle contribs)
  (define (aux pos neg acc)
    (cond ((or (null? pos)
               (null? neg)) acc)
          (else (let* ([dr   (first pos)]
                       [cr   (first neg)]
                       [damt (second dr)]
                       [camt (second cr)])
                  (cond ((< damt camt)
                         (aux (rest pos)
                              (cons (list (first cr) (- camt damt))
                                    neg)
                              (cons (result-tuple cr dr damt)
                                    acc)))
                        ((> damt camt)
                         (aux (cons (list (first dr) (- damt camt))
                                    pos)
                              (rest neg)
                              (cons (result-tuple cr dr camt)
                                    acc)))
                        (else (aux (rest pos)
                                   (rest neg)
                                   (cons (result-tuple cr dr camt)))))))))
  (let* ([share (get-share contribs)]
         [adj-contribs (adjusted-contribs contribs)]
         [pos (desc-by-balance (filter-by-balance adj-contribs positive?))]
         [neg (sort (map (lambda (c)
                           (list (first c)
                                 (abs (second c))))
                         (filter (lambda (c)
                                   (negative? (second c)))
                                 adj-contribs))
                    (lambda (a b)
                      (> (second a) (second b))))])
    (aux pos neg '())))

