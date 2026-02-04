document.addEventListener('DOMContentLoaded', function() {
    // 1. 轮播图逻辑
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const pagination = document.querySelector('.swiper-pagination');
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    const slides = document.querySelectorAll('.swiper-slide');
    const progressBar = document.querySelector('.swiper-progress-bar');
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoplayTimer;
    let progressInterval;

    // 生成分页器
    function createPagination() {
        pagination.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.className = i === currentIndex ? 'active' : '';
            dot.addEventListener('click', () => goToSlide(i));
            pagination.appendChild(dot);
        }
    }

    // 切换到指定轮播图
    function goToSlide(index) {
        currentIndex = index;
        const translateX = -currentIndex * (100 / slideCount);
        swiperWrapper.style.transform = `translateX(${translateX}%)`;
        
        // 更新分页器状态
        const dots = pagination.querySelectorAll('span');
        dots.forEach((dot, i) => {
            dot.className = i === currentIndex ? 'active' : '';
        });
        
        // 重置进度条
        resetProgressBar();
    }

    // 下一张
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }

    // 上一张
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(currentIndex);
    }

    // 进度条动画
    function startProgressBar() {
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 3s linear';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }

    function resetProgressBar() {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
            startProgressBar();
        }, 10);
    }

    // 自动轮播
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 5000);
        startProgressBar();
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
    }

    // 鼠标悬停暂停轮播
    const swiperContainer = document.querySelector('.swiper-container');
    swiperContainer.addEventListener('mouseenter', () => {
        stopAutoplay();
    });

    // 鼠标离开恢复轮播
    swiperContainer.addEventListener('mouseleave', () => {
        startAutoplay();
    });

    // 绑定箭头事件
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        setTimeout(startAutoplay, 1000);
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        setTimeout(startAutoplay, 1000);
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    swiperContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });

    swiperContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoplay, 1000);
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动
                nextSlide();
            } else {
                // 向右滑动
                prevSlide();
            }
        }
    }

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        }
    });

    // 2. 导航栏选中状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // 移除所有选中状态
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前选中状态
            this.classList.add('active');
            
            // 如果是当前页面链接，跳转
            if (href && href !== '#') {
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // 横向导航栏交互
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // 移除所有选中状态
            tabItems.forEach(tab => tab.classList.remove('active'));
            
            // 添加当前选中状态
            this.classList.add('active');
            
            // 添加点击动画
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'fadeInUp 0.6s ease';
            }, 10);
            
            // 跳转
            if (href && href !== '#') {
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // 3. 回到顶部功能
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. 卡片悬停效果
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // 5. 页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // 初始化轮播图
        createPagination();
        startAutoplay();
        
        // 添加页面加载完成效果
        const elements = document.querySelectorAll('.swiper-slide, .route-card, .tab-item');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    });

    // 6. 鼠标轨迹效果
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // 轻微的视差效果
        const elements = document.querySelectorAll('.route-card, .tab-item');
        elements.forEach(el => {
            const speed = el.dataset.speed || 20;
            const xMove = (x * speed) - (speed / 2);
            const yMove = (y * speed) - (speed / 2);
            el.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });

    // 7. 社交图标动画
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });

    console.log('王屋山旅游官网 - 优化版已加载完成！');
});