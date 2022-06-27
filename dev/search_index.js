var documenterSearchIndex = {"docs":
[{"location":"devdoc/#Implementing-custom-layers","page":"Developer Documentation","title":"Implementing custom layers","text":"","category":"section"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"NeuralGraphPDE basically share the same interface with Lux.jl. You may want to take a look at its doc first. Based on that, NeuralGraphPDE provides two abstract types, AbstractGNNLayer and AbstractGNNContainerLayer, they are subtypes of AbstractExplicitLayer and AbstractExplicitContainerLayer, respectively. You should subtype your custom layers to them.","category":"page"},{"location":"devdoc/#AbstractGNNLayer","page":"Developer Documentation","title":"AbstractGNNLayer","text":"","category":"section"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"You can define a custom layer with the following steps:","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"Step 1. Define your type of the layer and add initialgraph as a field.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"struct MyGNNLayer{F} <: AbstractGNNLayer\n    initialgraph::F\n    ...\nend","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"Step 2. Define initialparameters as in Lux. The default initialstates returns (graph = GNNGraph(...)), so this is optional. If you want to put more things in st then you need to overload initialstates as well.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"function initialstates(rng::AbstractRNG, l::AbstractGNNLayer)\n    (graph = l.initialgraph(), otherstates)\nend","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"In this case, it is recommended to also overload statelength, it should be like","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"statelength(l::AbstractGNNLayer) = 1 + length(otherstates) # 1 for the graph","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"Step 3. Define the constructor(s) that has the keyword argument initialgraph=initialgraph.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"function MyGNNLayer(...; initialgraph=initialgraph)\n  initalgraph = wrapgraph(initialgraph) # always wrap initialgraph so the input can be a graph or a function\n  MyGNNLayer{typeof(initialgraph), ...}(initialgraph,...)\nend","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"Step 4. Define the forward pass. Keep in mind that the graph is stored in st. It is recommended to store nontrainable node features in the graph.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"function (l::MyGNNLayer)(x,ps,st)\n    g = st.graph\n    s = g.ndata # nontrainable node features, if there is any\n    function message(xi, xj, e)\n        ...\n        return m\n    end\n    xs = merge(x, s) # assuming x is a named tuple\n    return propagte(message, g, l.aggr, xi = xs, xj = xs), st\nend","category":"page"},{"location":"devdoc/#AbstractExplicitContainerLayer","page":"Developer Documentation","title":"AbstractExplicitContainerLayer","text":"","category":"section"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"You should only subtype your layer to AbstractExplicitContainerLayer then","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"you need to write a custom message function, and\nthe layer contains other layers.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"For the most part it will look identical to defining AbstractGNNLayer. You just need to treat the message function more carefully.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"function message(xi, xj, e)\n        ...\n        m, st.nn = nn(..., st.nn)\n        st = merge(st, (nn = st_nn,))\n        return m\nend","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"Note that if you have only one neural layer insider a AbstractExplicitContainerLayer, then the parameters will be reduced but not the states.","category":"page"},{"location":"devdoc/","page":"Developer Documentation","title":"Developer Documentation","text":"julia> l = ExplicitEdgeConv(nn, initialgraph = g)\n\njulia> rng = Random.default_rng()\n\njulia> ps, st = Lux.setup(rng, l)\n\njulia> ps\n(weight = Float32[0.22180015 -0.09448394 … -0.41880473 -0.49083555; -0.23709725 0.05150031 … 0.48641983 0.14893274; … ; 0.42824164 0.5589718 … -0.5763395 0.18395355; 0.25994122 0.22801241 … 0.59201854 0.3832495], bias = Float32[0.0; 0.0; … ; 0.0; 0.0;;])\n\njulia> st\n(ϕ = NamedTuple(), graph = GNNGraph(3, 4))","category":"page"},{"location":"api/messagepassing/","page":"Message Passing","title":"Message Passing","text":"CurrentModule = NeuralGraphPDE","category":"page"},{"location":"api/messagepassing/#Message-Passing","page":"Message Passing","title":"Message Passing","text":"","category":"section"},{"location":"api/messagepassing/#Index","page":"Message Passing","title":"Index","text":"","category":"section"},{"location":"api/messagepassing/","page":"Message Passing","title":"Message Passing","text":"Order = [:type, :function]\nPages   = [\"messagepassing.md\"]","category":"page"},{"location":"api/messagepassing/#Docs","page":"Message Passing","title":"Docs","text":"","category":"section"},{"location":"api/messagepassing/","page":"Message Passing","title":"Message Passing","text":"apply_edges\npropagate","category":"page"},{"location":"api/utilities/","page":"Utilities","title":"Utilities","text":"CurrentModule = NeuralGraphPDE","category":"page"},{"location":"api/utilities/#Layers","page":"Utilities","title":"Layers","text":"","category":"section"},{"location":"api/utilities/#Index","page":"Utilities","title":"Index","text":"","category":"section"},{"location":"api/utilities/","page":"Utilities","title":"Utilities","text":"Order = [:type, :function]\nModules = [NeuralGraphPDE]\nPages = [\"utilities.md\"]","category":"page"},{"location":"api/utilities/#Docs","page":"Utilities","title":"Docs","text":"","category":"section"},{"location":"api/utilities/","page":"Utilities","title":"Utilities","text":"Modules = [NeuralGraphPDE]\nPages   = [\"utils.jl\"]\nPrivate = false","category":"page"},{"location":"api/utilities/#NeuralGraphPDE.updategraph-Tuple{NamedTuple, GraphNeuralNetworks.GNNGraphs.GNNGraph}","page":"Utilities","title":"NeuralGraphPDE.updategraph","text":"updategraph(st, g) -> st\n\nRecursively replace the value of graph with a shallow copy of g.\n\n\n\n\n\n","category":"method"},{"location":"api/utilities/","page":"Utilities","title":"Utilities","text":"copy","category":"page"},{"location":"api/utilities/#Base.copy","page":"Utilities","title":"Base.copy","text":"copy(g::GNNGraph)\n\nCreate a shollow copy of the input graph g. This is equivalent to GNNGraph(g).\n\n\n\n\n\n","category":"function"},{"location":"api/layers/","page":"Layers","title":"Layers","text":"CurrentModule = NeuralGraphPDE","category":"page"},{"location":"api/layers/#Layers","page":"Layers","title":"Layers","text":"","category":"section"},{"location":"api/layers/#Index","page":"Layers","title":"Index","text":"","category":"section"},{"location":"api/layers/","page":"Layers","title":"Layers","text":"Order = [:type, :function]\nModules = [NeuralGraphPDE]\nPages = [\"layers.md\"]","category":"page"},{"location":"api/layers/#Docs","page":"Layers","title":"Docs","text":"","category":"section"},{"location":"api/layers/","page":"Layers","title":"Layers","text":"Modules = [NeuralGraphPDE]\nPages   = [\"layers.jl\"]\nPrivate = false","category":"page"},{"location":"api/layers/#NeuralGraphPDE.AbstractGNNContainerLayer","page":"Layers","title":"NeuralGraphPDE.AbstractGNNContainerLayer","text":"AbstractGNNContainerLayer <: AbstractExplicitContainerLayer\n\nThis is an abstract type of GNN layers that contains other layers.\n\n\n\n\n\n","category":"type"},{"location":"api/layers/#NeuralGraphPDE.AbstractGNNLayer","page":"Layers","title":"NeuralGraphPDE.AbstractGNNLayer","text":"AbstractGNNLayer <: AbstractExplicitLayer\n\nAn abstract type of graph neural networks. See also AbstractGNNContainerLayer\n\n\n\n\n\n","category":"type"},{"location":"api/layers/#NeuralGraphPDE.ExplicitEdgeConv","page":"Layers","title":"NeuralGraphPDE.ExplicitEdgeConv","text":"ExplicitEdgeConv(ϕ; initialgraph = initialgraph, aggr = mean)\n\nEdge convolutional layer.\n\nmathbfh_i = square_j in N(i) phi(mathbfh_i mathbfh_j mathbfx_j - mathbfx_i)\n\nArguments\n\nϕ: A neural network. \ninitialgraph: GNNGraph or a function that returns a GNNGraph\naggr: Aggregation operator for the incoming messages (e.g. +, *, max, min, and mean).\n\nInputs\n\nh: Trainable node embeddings, NamedTuple or Array.\n\nReturns\n\nNamedTuple or Array that has the same struct with x with different a size of channels.\n\nParameters\n\nParameters of ϕ.\n\nStates\n\ngraph: GNNGraph where graph.ndata.x represents the spatial coordinates of nodes. You can also put other nontrainable node features in graph.ndata with arbitrary keys. They will be concatenated like u.\n\nExamples\n\n\ns = [1, 1, 2, 3]\nt = [2, 3, 1, 1]\ng = GNNGraph(s, t)\n\nu = randn(4, g.num_nodes)\ng = GNNGraph(g, ndata = (; x = rand(3, g.num_nodes)))\nnn = Dense(4 + 4 + 3 => 5)\nl = ExplicitEdgeConv(nn, initialgraph=g)\n\nrng = Random.default_rng()\nps, st = Lux.setup(rng, l)\n\n\n\n\n\n\n","category":"type"},{"location":"api/layers/#NeuralGraphPDE.ExplicitGCNConv","page":"Layers","title":"NeuralGraphPDE.ExplicitGCNConv","text":"ExplicitGCNConv(in_chs::Int, out_chs::Int, activation = identity;\n                initialgraph = initialgraph, init_weight = glorot_normal,\n                init_bias = zeros32)\n\nSame as the one in GraphNeuralNetworks.jl but with exiplicit paramters.\n\nArguments\n\ninitialgraph: GNNGraph or a function that returns a GNNGraph\n\nExamples\n\n# create data\ns = [1,1,2,3]\nt = [2,3,1,1]\ng = GNNGraph(s, t)\nx = randn(3, g.num_nodes)\n\n# create layer\nl = ExplicitGCNConv(3 => 5, initialgraph = g) \n\n# setup layer\nrng = Random.default_rng()\nRandom.seed!(rng, 0)\n\nps, st = Lux.setup(rng, l)\n\n# forward pass\ny = l(x, ps, st)       # size:  5 × num_nodes\n\n\n\n\n\n","category":"type"},{"location":"api/layers/#NeuralGraphPDE.MPPDEConv","page":"Layers","title":"NeuralGraphPDE.MPPDEConv","text":"MPPDEConv(ϕ, ψ; initialgraph = initialgraph, aggr = sum, local_features = (:u, :x))\n\nConvolutional layer from Message Passing Neural PDE Solvers, without the temporal bulking trick.\n\nbeginaligned\n\tmathbfm_i=Box _jin N(i)phi (mathbfh_imathbfh_jmathbfu_i-mathbfu_jmathbfx_i-mathbfx_jtheta )\n\tmathbfh_i=psi (mathbfh_imathbfm_itheta )\nendaligned\n\nArguments\n\nϕ: The neural network for the message function. \nψ: The neural network for the update function.\ninitialgraph: GNNGraph or a function that returns a GNNGraph\naggr: Aggregation operator for the incoming messages (e.g. +, *, max, min, and mean).\nlocal_features: The features that will be differentiated in the message function. \n\nInputs\n\nh: Trainable node embeddings, Array.\n\nReturns\n\nNamedTuple or Array that has the same struct with x with different a size of channels.\n\nParameters\n\nParameters of ϕ.\nParameters of ψ.\n\nStates\n\ngraph: GNNGraph where graph.ndata.x represents the spatial coordinates of nodes, graph.ndata.u represents the initial condition,\n\n   and `graph.gdata.θ` represents the graph level features of the underlying PDE. `θ` should be a vector.\n\nExamples\n\ng = rand_graph(10, 6)\n\ng = GNNGraph(g, ndata = (; u = rand(2, 10), x = rand(3, 10)), gdata = (; θ = rand(4)))\nh = randn(5, 10)\nϕ = Dense(5 + 5 + 2 + 3 + 4 => 5)\nψ = Dense(5 + 5 + 4 => 7)\nl = MPPDEConv(ϕ, ψ, initialgraph = g)\n\nrng = Random.default_rng()\nps, st = Lux.setup(rng, l)\n\ny, st = l(h, ps, st)\n\n\n\n\n\n","category":"type"},{"location":"api/layers/#NeuralGraphPDE.VMHConv","page":"Layers","title":"NeuralGraphPDE.VMHConv","text":"VMHConv(ϕ, γ; initialgraph = initialgraph, aggr = mean)\n\nConvolutional layer from Learning continuous-time PDEs from sparse data with graph neural networks.\n\nbeginaligned\nmathbfm_i = square_j in N(i) phi(mathbfh_i mathbfh_j - mathbfh_i mathbfx_j - mathbfx_i)\nmathbfh_i = gamma(mathbfh_i mathbfm_i)\nendaligned\n\nArguments\n\nϕ: The neural network for the message function. \nγ: The neural network for the update function.\ninitialgraph: GNNGraph or a function that returns a GNNGraph\naggr: Aggregation operator for the incoming messages (e.g. +, *, max, min, and mean).\n\nInputs\n\nh: Trainable node embeddings, NamedTuple or Array.\n\nReturns\n\nNamedTuple or Array that has the same struct with x with different a size of channels.\n\nParameters\n\nParameters of ϕ.\nParameters of γ.\n\nStates\n\ngraph: GNNGraph where graph.ndata.x represents the spatial coordinates of nodes.\n\nExamples\n\n\ns = [1, 1, 2, 3]\nt = [2, 3, 1, 1]\ng = GNNGraph(s, t)\n\nu = randn(4, g.num_nodes)\ng = GNNGraph(g, ndata = (; x = rand(3, g.num_nodes)))\nϕ = Dense(4 + 4 + 3 => 5)\nγ = Dense(5 + 4 => 7)\nl = VMHConv(ϕ, γ, initialgraph = g)\n\nrng = Random.default_rng()\nps, st = Lux.setup(rng, l)\n\ny, st = l(u, ps, st)\n\n\n\n\n\n","category":"type"},{"location":"tutorials/graph_node/#Neural-Graph-Ordinary-Differential-Equations","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"This tutorial is adapted from SciMLSensitivity, GraphNeuralNetworks, and Lux.","category":"page"},{"location":"tutorials/graph_node/#Load-the-packages","page":"Neural Graph Ordinary Differential Equations","title":"Load the packages","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"using GraphNeuralNetworks, NeuralGraphPDE, DifferentialEquations\nimport NeuralGraphPDE: initialgraph\nusing Lux, NNlib, Optimisers, Zygote, Random, ComponentArrays\nusing SciMLSensitivity\nusing Statistics: mean\nusing MLDatasets: Cora\nusing CUDA\nCUDA.allowscalar(false)\ndevice = CUDA.functional() ? gpu : cpu","category":"page"},{"location":"tutorials/graph_node/#Load-data","page":"Neural Graph Ordinary Differential Equations","title":"Load data","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"onehotbatch(data, labels) = device(labels) .== reshape(data, 1, size(data)...)\nonecold(y) = map(argmax, eachcol(y))\n\ndataset = Cora();\nclasses = dataset.metadata[\"classes\"]\ng = device(mldataset2gnngraph(dataset))\nX = g.ndata.features\ny = onehotbatch(g.ndata.targets, classes) # a dense matrix is not the optimal\n(; train_mask, val_mask, test_mask) = g.ndata\nytrain = y[:, train_mask]","category":"page"},{"location":"tutorials/graph_node/#Model-and-data-configuration","page":"Neural Graph Ordinary Differential Equations","title":"Model and data configuration","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"nin = size(X, 1)\nnhidden = 16\nnout = length(classes)\nepochs = 40","category":"page"},{"location":"tutorials/graph_node/#Define-Neural-ODE","page":"Neural Graph Ordinary Differential Equations","title":"Define Neural ODE","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"struct NeuralODE{M <: Lux.AbstractExplicitLayer, So, Se, T, K} <:\n       Lux.AbstractExplicitContainerLayer{(:model,)}\n    model::M\n    solver::So\n    sensealg::Se\n    tspan::T\n    kwargs::K\nend\n\nfunction NeuralODE(model::Lux.AbstractExplicitLayer;\n                   solver = Tsit5(),\n                   sensealg = InterpolatingAdjoint(; autojacvec = ZygoteVJP()),\n                   tspan = (0.0f0, 1.0f0),\n                   kwargs...)\n    return NeuralODE(model, solver, sensealg, tspan, kwargs)\nend\n\nfunction (n::NeuralODE)(x, ps, st)\n    function dudt(u, p, t)\n        u_, st = n.model(u, p, st)\n        return u_\n    end\n    prob = ODEProblem{false}(ODEFunction{false}(dudt), x, n.tspan, ps)\n    return solve(prob, n.solver; sensealg = n.sensealg, n.kwargs...), st\nend\n\nfunction diffeqsol_to_array(x::ODESolution{T, N, <:AbstractVector{<:CuArray}}) where {T, N}\n    return dropdims(gpu(x); dims = 3)\nend\ndiffeqsol_to_array(x::ODESolution) = dropdims(Array(x); dims = 3)","category":"page"},{"location":"tutorials/graph_node/#Create-and-initialize-the-Neural-Graph-ODE-layer","page":"Neural Graph Ordinary Differential Equations","title":"Create and initialize the Neural Graph ODE layer","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"function create_model()\n    node_chain = Chain(ExplicitGCNConv(nhidden => nhidden, relu),\n                       ExplicitGCNConv(nhidden => nhidden, relu))\n\n    node = NeuralODE(node_chain,\n                     save_everystep = false,\n                     reltol = 1e-3, abstol = 1e-3, save_start = false)\n\n    model = Chain(ExplicitGCNConv(nin => nhidden, relu),\n                  node,\n                  diffeqsol_to_array,\n                  Dense(nhidden, nout))\n\n    rng = Random.default_rng()\n    Random.seed!(rng, 0)\n\n    ps, st = Lux.setup(rng, model)\n    ps = ComponentArray(ps) |> device\n    st = updategraph(st, g) |> device\n\n    return model, ps, st\nend","category":"page"},{"location":"tutorials/graph_node/#Define-the-loss-function","page":"Neural Graph Ordinary Differential Equations","title":"Define the loss function","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"logitcrossentropy(ŷ, y) = mean(-sum(y .* logsoftmax(ŷ); dims = 1))\n\nfunction loss(x, y, mask, model, ps, st)\n    ŷ, st = model(x, ps, st)\n    return logitcrossentropy(ŷ[:, mask], y), st\nend\n\nfunction eval_loss_accuracy(X, y, mask, model, ps, st)\n    ŷ, _ = model(X, ps, st)\n    l = logitcrossentropy(ŷ[:, mask], y[:, mask])\n    acc = mean(onecold(ŷ[:, mask]) .== onecold(y[:, mask]))\n    return (loss = round(l, digits = 4), acc = round(acc * 100, digits = 2))\nend","category":"page"},{"location":"tutorials/graph_node/#Train-the-model","page":"Neural Graph Ordinary Differential Equations","title":"Train the model","text":"","category":"section"},{"location":"tutorials/graph_node/","page":"Neural Graph Ordinary Differential Equations","title":"Neural Graph Ordinary Differential Equations","text":"function train()\n    model, ps, st = create_model()\n\n    # Optimizer\n    opt = Optimisers.Adam(0.01f0)\n    st_opt = Optimisers.setup(opt, ps)\n\n    # Training Loop\n    for epoch in 1:epochs\n        (l, st), back = pullback(p -> loss(X, ytrain, train_mask, model, p, st), ps)\n        gs = back((one(l), nothing))[1]\n        st_opt, ps = Optimisers.update(st_opt, ps, gs)\n        @show eval_loss_accuracy(X, y, val_mask, model, ps, st)\n    end\nend\n\ntrain()","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = NeuralGraphPDE","category":"page"},{"location":"#NeuralGraphPDE","page":"Home","title":"NeuralGraphPDE","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for NeuralGraphPDE.","category":"page"},{"location":"#Features","page":"Home","title":"Features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Layers and graphs are coupled and decoupled at the same time: You can bind a graph to a layer at initialization, but the graph is stored in st, not in the layer. They are decoupled in the sense that you can easily update or change the graph by changing st:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using NeuralGraphPDE, GraphNeuralNetworks, Random, Lux\ng = rand_graph(5, 4, bidirected = false)\nx = randn(3, g.num_nodes)\n\n# create layer\nl = ExplicitGCNConv(3 => 5, initialgraph = g)\n\n# setup layer\nrng = Random.default_rng()\nRandom.seed!(rng, 0)\n\nps, st = Lux.setup(rng, l)\n\n# forward pass\ny, st = l(x, ps, st)    # you don't need to feed a graph explicitly\n\n#change the graph\nnew_g = rand_graph(5, 7, bidirected = false)\nst = updategraph(st, new_g)\n\ny, st = l(x, ps, st)","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can omit the keyword argument initalgraph at initialization, and then call updategraph on st to put the graph in it. All gnn layer can work smoothly with other layers.","category":"page"},{"location":"","page":"Home","title":"Home","text":"g = rand_graph(5, 4, bidirected = false)\nx = randn(3, g.num_nodes)\n\nmodel = Chain(Dense(3 => 5),\n              ExplicitGCNConv(5 => 5),\n              ExplicitGCNConv(5 => 3))  # you don't need to use `g` for initalization\n# setup layer\nrng = Random.default_rng()\nRandom.seed!(rng, 0)\n\nps, st = Lux.setup(rng, model) # the default graph is empty\nst = updategraph(st, g) # put the graph in st\n\n# forward pass\ny, st = model(x, ps, st)","category":"page"},{"location":"","page":"Home","title":"Home","text":"An unified interface for graph level tasks. As pointed out here, GNNs are difficult to work well with other neural networks when the input graph is changing. This will not be an issue here. You have an unified interface y, st = model(x, ps, st).\nTrainable node embeddings and nontrainable features are seperately stored in x and st.graph.","category":"page"}]
}
