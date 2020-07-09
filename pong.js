var g_Canvas = document.getElementById("MyCanvas");
var g_Context = g_Canvas.getContext("2d");
var g_FPS = 60;
var g_TimeInterval = 1000/g_FPS;
var g_playerWidth = 10
var g_playerHeight = 75
var g_player1 = new c_player(g_Canvas.width-g_playerWidth,(g_Canvas.height-g_playerHeight)/2,g_playerWidth,g_playerHeight,"blue")
var g_player2 = new c_player(0,(g_Canvas.height-g_playerHeight)/2,g_playerWidth,g_playerHeight,"red")
var g_ball = new c_ball(g_Canvas.width/2,g_Canvas.height/2,10,'green')

function f_ClearCanvas()
{
   g_Context.clearRect(0,0,g_Canvas.width,g_Canvas.height);
   g_Context.strokeRect(0,0,g_Canvas.width,g_Canvas.height); 

}

function c_ball(l_x,l_y,l_r,l_c)
{
    this.x = l_x;
    this.y = l_y;
    this.r = l_r;
    this.c = l_c;
    this.speedX = 5
    this.speedY = 5
    this.isAlive = false
    this.start = false
    this.score1 = 0
    this.score2 = 0

    this.m_draw = function m_draw(l_ctx)
    {
        l_ctx.beginPath();
        l_ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        l_ctx.fillStyle = this.c;
        l_ctx.fill();
        l_ctx.closePath();               
    }
    this.m_move = function m_move()
    {
        if(this.start)
        {   
            this.x += this.speedX
            this.y += this.speedY
        }
    }
    this.m_checkCollision = function m_checkCollision(l_cnvs)
    {
        if(this.y+this.r >= l_cnvs.height || this.y -this.r <= 0 )
            {
                if(this.y+this.r >= l_cnvs.height)
                    {
                        this.y = l_cnvs.height - this.r
                    }
                if(this.y-this.r <=0)
                    {
                        this.y = this.r
                    }
                this.speedY = - this.speedY
            }
        if(this.x+this.r >= l_cnvs.width || this.x -this.r <= 0 )
            {
                this.isAlive = false
                this.start = false
                if(this.x+this.r>=l_cnvs.width) 
                {
                    this.score1++
                }
                if(this.x -this.r <= 0) 
                {
                    this.score2++
                }
            }
    }
}

function c_player(l_x,l_y,l_w,l_h,l_c)
{
    this.x = l_x;
    this.y = l_y;
    this.w = l_w;
    this.h = l_h;
    this.c = l_c;
    this.speedY = 10;
    this.moveUp = false
    this.movedown = false

    this.m_move = function m_move()
    { 
       if(this.moveUp) this.y -= this.speedY
       if(this.movedown) this.y += this.speedY
    }
    this.m_draw = function m_draw(l_ctx)
    {
        l_ctx.fillStyle = this.c;
        l_ctx.fillRect(this.x,this.y,this.w,this.h);
    }
    this.m_checkCollision = function m_checkCollision(l_cnvs)
    {
        if(this.y+this.h >= l_cnvs.height)
            {
                this.y = l_cnvs.height - this.h
            }
        if(this.y<=0)
            {
                this.y = 0
            }
    }
}
function f_CPUPlayermovement()
{
    //g_player2.y =  g_ball.y - (g_player2.h/2)
    g_player2.moveUp = false
    g_player2.movedown = false
    console.log(g_player2.speedY)
    //if( g_ball.x - g_player2.x <= 100 )
       {
            if(g_player2.y >= g_ball.y)
                {
                    g_player2.moveUp = true
                }
            else
                {
                    g_player2.movedown = true
                }
           if(g_ball.y >= g_player2.y && g_ball.y <= g_player2.y+g_player2.h)
               {
                   g_player2.moveUp = false
                   g_player2.movedown = false
               }
        }
}
function f_checkCollisionBetweenPlayersAndBall()
{
    if(g_ball.x+g_ball.r >= g_player1.x && g_ball.y >= g_player1.y && g_ball.y <= g_player1.y+g_player1.h)
        {
            g_ball.speedX = - g_ball.speedX
            g_ball.x = g_player1.x - g_ball.r
        }
    if(g_ball.x-g_ball.r <= g_player2.x +g_player2.w && g_ball.y >= g_player2.y && g_ball.y <= g_player2.y+g_player2.h )
        {
            g_ball.speedX = - g_ball.speedX
            g_ball.x = g_player2.x + g_ball.r +g_player2.w
            g_player2.speedY = parseInt((Math.random()*9)+1)
        }
}
function f_printScores()
{
    g_Context.fillStyle = 'black'
    g_Context.font = '20px Arial'
    g_Context.fillText(''+g_ball.score1,g_Canvas.width/2-100,50)
    g_Context.fillText(''+g_ball.score2 ,g_Canvas.width/2+100,50)
}
function f_gameOver()
{
    if(g_ball.score1 >=3 || g_ball.score2 >= 3)
        {
            f_ClearCanvas()
            g_Context.fillStyle = 'black'
            g_Context.font = '30px Arial '
            if(g_ball.score1>=3)
                {
                    g_Context.fillText('CPU wins',300,g_Canvas.height/2)
                }
            if(g_ball.score2>=3)
                {
                    g_Context.fillText('player wins',300,g_Canvas.height/2)
                }
        }
}

function f_reset()
{
    if(!g_ball.isAlive)
        {
            g_ball.x = g_Canvas.width/2
            g_ball.y = g_Canvas.height/2
            g_player2.speedY = 10
        }
}
function f_GameLoop() 
{   
    f_reset()
    g_player1.m_move()
    g_player2.m_move()
    g_ball.m_move() 
    f_CPUPlayermovement()
    g_ball.m_checkCollision(g_Canvas)
    g_player1.m_checkCollision(g_Canvas)
    g_player2.m_checkCollision(g_Canvas)
    f_checkCollisionBetweenPlayersAndBall()
    f_ClearCanvas();
    g_player1.m_draw(g_Context)
    g_player2.m_draw(g_Context)
    g_ball.m_draw(g_Context)
    f_printScores()
    f_gameOver()
}
setInterval(f_GameLoop,g_TimeInterval)
document.addEventListener('keydown',f_keydowneventHandler)
document.addEventListener('keyup',f_keyUpEventHandler)

function f_keydowneventHandler(l_event)
{
    switch(l_event.keyCode)
    {
        case 40:
            g_player1.movedown = true
            break;
        case 38:
            g_player1.moveUp = true
            break;
        case 32 :
            g_ball.start = true
            g_ball.isAlive = true
    }
}
function f_keyUpEventHandler(l_event)
{
  switch(l_event.keyCode)
  {
        case 40:
            g_player1.movedown = false
            break;
        case 38:
            g_player1.moveUp = false
            break;
    }
}