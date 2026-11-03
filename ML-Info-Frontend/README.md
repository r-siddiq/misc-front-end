# ML Info Frontend

A lightweight, **frontend-only**, **multi-page static site** introducing core **machine learning** concepts—learning paradigms, algorithms, model evaluation, and future trends—using **HTML5** and **CSS3** (no build step).

- **Live demo:** https://www.r-siddiq.tech/ML-Info-Frontend/
- **Additonal context:** https://www.rsiddiq.com/internet-programming.html
- **Scope:** Frontend-only, static content
- **Tech:** HTML5, CSS3

---

## Pages

- **index.html** – Overview of machine learning and key learning paradigms.
- **algorithms.html** – Survey of common ML algorithms across paradigms with an illustrative code snippet.
- **evaluation.html** – Model evaluation metrics (classification/regression) and validation strategies.
- **future.html** – Trends like Transformers, Generative AI, and Quantum ML.

---

## Features

- **Static, no-build**: open `index.html` directly—no tooling or server required.
- **Consistent navigation** across pages.
- **Responsive images** via CSS (`max-width: 100%`) and viewport meta tag.
- **Accessible alt text** on images.
- **Academic context**: created for an Internet Programming course; content is educational.

---

## Project Structure

```
ML-Info-Frontend/
├─ index.html, algorithms.html, evaluation.html, future.html
├─ css/
│  └─ styles.css
└─ img/
   └─ confusion_matrix.jpg, future_ml.jpg, headshot.jpg, kfold_cv.jpg, reinforcement_learning.jpg, supervised_learning.jpg, unsupervised_learning.jpg
```

---

## Getting Started

### Option A: Open directly
Double-click `index.html` in any modern browser.

### Option B (recommended): Serve statically
Some browsers throttle local assets. Use a simple local server:

- **Python 3**
  ```bash
  python -m http.server
  ```
  Visit http://localhost:8000/

- **Node (npx)**
  ```bash
  npx http-server .
  ```
  Follow the printed URL.

---

## References & Acknowledgments

- **scikit-learn:** https://scikit-learn.org
- **IBM ML overview:** https://www.ibm.com/topics/machine-learning
- **WEF on Quantum ML:** https://www.weforum.org/agenda/2022/06/quantum-machine-learning-cybersecurity/
- **“Attention is All You Need” (Transformer):** https://arxiv.org/abs/1706.03762