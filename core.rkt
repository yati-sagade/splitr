(define (sum xs)
  (foldl + 0 xs))

(define (new-split contributions)
  (let* ((total    (total-expense contributions))
         (share    (/ total (length contributions)))
         (balances (map (lambda (contrib)
                          (balance (get-amount contrib) share))
                        contributions)))
    ()
    (list total share)))

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


(define (settle into drs)
  (define (aux drs solution)
    (cond ((or (null drs)
               (= (get-amount into) 0))
           (list solution drs))
          (else (let ([dr   (first drs)]
                      [damt (get-amount dr)]
                      [amt  (get-amount into)])
                  (if (< damt amt)
                      (aux )))))))

(define (make-contrib name amount)
  (list name amount))

(define get-name first)

(define get-amount second)

(define (balance contribution share)
  (- contribution share))

(define (names contributions)
  (map first contributions))

(define (total-expense contributions)
  (sum (map second contributions)))

(define (test)
  (let* ([xs '(("first"   10)
               ("second"  25)
               ("third"  100)
               ("fourth"   0))]
         [cs (map (lambda (t)
                    (apply make-contrib t))
                  xs)])
    (new-split cs)))


(define ())

